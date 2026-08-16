<?php

namespace Tests\Feature\Audit;

use App\Models\AuditEvent;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuditTrailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_administrator_can_view_the_audit_trail(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->get(route('audit-trail.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('AuditTrail/Index')
                ->where('filters.period', 90)
                ->where('canExport', true)
                ->has('events', 0)
            );
    }

    public function test_manager_cannot_view_or_export_the_audit_trail(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');

        $this->actingAs($manager)
            ->get(route('audit-trail.index'))
            ->assertForbidden();

        $this->actingAs($manager)
            ->get(route('audit-trail.export'))
            ->assertForbidden();
    }

    public function test_staff_cannot_view_the_audit_trail(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');

        $this->actingAs($staff)
            ->get(route('audit-trail.index'))
            ->assertForbidden();
    }

    public function test_creating_a_product_writes_an_audit_event(): void
    {
        $manager = User::factory()->create([
            'first_name' => 'Mina',
            'last_name' => 'Chen',
        ]);
        $manager->assignRole('Manager');
        $category = Category::factory()->create(['code' => 'ACC']);

        $this->actingAs($manager)
            ->post(route('products.store'), $this->productPayload($category->id))
            ->assertRedirect(route('products.index'));

        $product = Product::query()->firstOrFail();

        $this->assertDatabaseHas('audit_events', [
            'actor_id' => $manager->id,
            'actor_name' => 'Mina Chen',
            'actor_role' => 'Manager',
            'action' => AuditEvent::ACTION_CREATED,
            'subject_type' => AuditEvent::SUBJECT_PRODUCT,
            'subject_id' => $product->id,
            'subject_label' => "{$product->name} ({$product->sku})",
        ]);
    }

    public function test_updating_a_product_writes_changed_fields(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $product = Product::factory()->create([
            'name' => 'Old Name',
            'quantity' => 4,
            'status' => true,
        ]);

        $this->actingAs($manager)
            ->put(route('products.update', $product), [
                ...$this->productPayload($product->category_id),
                'name' => 'New Name',
                'quantity' => 9,
                'brand' => $product->brand,
                'model' => $product->model,
            ])
            ->assertRedirect(route('products.show', $product));

        $event = AuditEvent::query()
            ->where('action', AuditEvent::ACTION_UPDATED)
            ->where('subject_type', AuditEvent::SUBJECT_PRODUCT)
            ->firstOrFail();

        $this->assertSame($manager->id, $event->actor_id);
        $this->assertSame('Old Name', $event->changes['name']['old']);
        $this->assertSame('New Name', $event->changes['name']['new']);
        $this->assertSame(4, $event->changes['quantity']['old']);
        $this->assertSame(9, $event->changes['quantity']['new']);
    }

    public function test_creating_a_category_writes_an_audit_event(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('categories.store'), [
                'name' => 'Accessories',
                'code' => 'ACC',
                'description' => 'Accessory items',
            ])
            ->assertRedirect(route('categories.index'));

        $this->assertDatabaseHas('audit_events', [
            'actor_id' => $admin->id,
            'action' => AuditEvent::ACTION_CREATED,
            'subject_type' => AuditEvent::SUBJECT_CATEGORY,
            'subject_label' => 'Accessories (ACC)',
        ]);
    }

    public function test_creating_a_user_writes_an_audit_event_without_a_password(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('users.store'), [
                'first_name' => 'Alex',
                'last_name' => 'Rivera',
                'username' => 'alex.rivera',
                'email' => 'alex.rivera@example.com',
                'phone_number' => '5550100',
                'role' => User::ROLE_STAFF,
                'is_active' => true,
            ])
            ->assertRedirect(route('users.index'));

        $created = User::query()->where('email', 'alex.rivera@example.com')->firstOrFail();
        $event = AuditEvent::query()
            ->where('subject_type', AuditEvent::SUBJECT_USER)
            ->where('subject_id', $created->id)
            ->firstOrFail();

        $this->assertSame('Alex Rivera (alex.rivera)', $event->subject_label);
        $this->assertNull($event->changes);
        $this->assertStringNotContainsString('password', json_encode($event->getAttributes()));
    }

    public function test_stock_movements_do_not_write_audit_events(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $product = Product::factory()->create([
            'quantity' => 4,
            'status' => true,
        ]);

        $this->actingAs($staff)
            ->post(route('stock-movements.stock-in.store'), [
                'product_id' => $product->id,
                'quantity' => 6,
                'reason' => StockMovement::REASON_PURCHASE,
            ])
            ->assertRedirect(route('stock-movements.index'));

        $this->assertDatabaseCount('audit_events', 0);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'type' => StockMovement::TYPE_STOCK_IN,
        ]);
    }

    public function test_audit_trail_hides_events_older_than_ninety_days(): void
    {
        $admin = $this->admin();
        $product = Product::factory()->create();

        $visible = AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'Visible product',
        );
        $expired = AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'Expired product',
        );
        $expired->forceFill([
            'created_at' => now()->subDays(91),
            'updated_at' => now()->subDays(91),
        ])->save();

        $this->actingAs($admin)
            ->get(route('audit-trail.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
                ->where('events.0.id', $visible->id)
            );
    }

    public function test_audit_trail_period_filter_limits_results(): void
    {
        $admin = $this->admin();
        $product = Product::factory()->create();

        $recent = AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'Recent product',
        );
        $older = AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'Older product',
        );
        $older->forceFill([
            'created_at' => now()->subDays(45),
            'updated_at' => now()->subDays(45),
        ])->save();

        $this->actingAs($admin)
            ->get(route('audit-trail.index', ['period' => 30]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 1)
                ->where('events.0.id', $recent->id)
                ->where('filters.period', 30)
            );

        $this->actingAs($admin)
            ->get(route('audit-trail.index', ['period' => 60]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('events', 2)
            );
    }

    public function test_pruning_deletes_audit_events_older_than_ninety_days(): void
    {
        $admin = $this->admin();
        $product = Product::factory()->create();

        $kept = AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'Kept product',
        );
        $removed = AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'Removed product',
        );
        $removed->forceFill([
            'created_at' => now()->subDays(91),
            'updated_at' => now()->subDays(91),
        ])->save();

        $this->artisan('model:prune', [
            '--model' => [AuditEvent::class],
        ])->assertSuccessful();

        $this->assertDatabaseHas('audit_events', ['id' => $kept->id]);
        $this->assertDatabaseMissing('audit_events', ['id' => $removed->id]);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_administrator_can_export_the_filtered_audit_trail_pdf(): void
    {
        $admin = $this->admin();
        $product = Product::factory()->create();

        AuditEvent::record(
            $admin,
            AuditEvent::ACTION_CREATED,
            AuditEvent::SUBJECT_PRODUCT,
            $product,
            'PDF product',
        );

        $response = $this->actingAs($admin)
            ->get(route('audit-trail.export', ['period' => 30]));

        $response->assertOk();
        $this->assertStringContainsString(
            'application/pdf',
            (string) $response->headers->get('content-type'),
        );
        $this->assertStringContainsString(
            'audit-trail-last-30-days.pdf',
            (string) $response->headers->get('content-disposition'),
        );
    }

    private function admin(): User
    {
        $admin = User::factory()->create([
            'first_name' => 'Ada',
            'last_name' => 'Admin',
        ]);
        $admin->assignRole('Administrator');

        return $admin;
    }

    /**
     * @return array<string, mixed>
     */
    private function productPayload(int $categoryId): array
    {
        return [
            'name' => 'Wireless Keyboard',
            'category_id' => $categoryId,
            'brand' => 'Logitech',
            'model' => 'K6',
            'description' => 'A compact keyboard',
            'price' => 49.99,
            'quantity' => 10,
            'minimum_stock' => 2,
            'status' => true,
        ];
    }
}
