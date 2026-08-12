<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StockOutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_can_record_stock_out_with_auditable_details(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 10,
            'minimum_stock' => 5,
            'status' => true,
        ]);

        $this->actingAs($staff)
            ->post(route('inventory.stock-out.store'), [
                'product_id' => $product->id,
                'quantity' => 4,
                'reason' => StockMovement::REASON_CUSTOMER_SALE,
                'reference' => 'SALE-1042',
                'notes' => 'Collected at the front desk.',
            ])
            ->assertRedirect(route('inventory.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 6,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'user_id' => $staff->id,
            'quantity' => 4,
            'type' => StockMovement::TYPE_STOCK_OUT,
            'reason' => StockMovement::REASON_CUSTOMER_SALE,
            'reference' => 'SALE-1042',
            'remarks' => 'Collected at the front desk.',
        ]);
        $this->assertNotNull(StockMovement::query()->firstOrFail()->created_at);
    }

    public function test_stock_out_reasons_remain_distinguishable(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create(['quantity' => 10]);

        $this->actingAs($staff)->post(route('inventory.stock-out.store'), [
            'product_id' => $product->id,
            'quantity' => 1,
            'reason' => StockMovement::REASON_CUSTOMER_SALE,
        ])->assertRedirect();

        $this->actingAs($staff)->post(route('inventory.stock-out.store'), [
            'product_id' => $product->id,
            'quantity' => 1,
            'reason' => StockMovement::REASON_INTERNAL_REQUEST,
            'reference' => 'Operations team',
        ])->assertRedirect();

        $this->assertDatabaseCount('stock_movements', 2);
        $this->assertDatabaseHas('stock_movements', [
            'reason' => StockMovement::REASON_CUSTOMER_SALE,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'reason' => StockMovement::REASON_INTERNAL_REQUEST,
            'reference' => 'Operations team',
        ]);
    }

    public function test_internal_request_requires_a_recipient_or_reference(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create(['quantity' => 10]);

        $this->actingAs($staff)
            ->from(route('inventory.index'))
            ->post(route('inventory.stock-out.store'), [
                'product_id' => $product->id,
                'quantity' => 1,
                'reason' => StockMovement::REASON_INTERNAL_REQUEST,
            ])
            ->assertRedirect(route('inventory.index'))
            ->assertSessionHasErrors('reference');

        $this->assertDatabaseCount('stock_movements', 0);
        $this->assertSame(10, $product->fresh()->quantity);
    }

    public function test_inactive_product_cannot_be_stocked_out(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 10,
            'status' => false,
        ]);

        $this->actingAs($staff)
            ->from(route('inventory.index'))
            ->post(route('inventory.stock-out.store'), [
                'product_id' => $product->id,
                'quantity' => 1,
                'reason' => StockMovement::REASON_CUSTOMER_SALE,
            ])
            ->assertRedirect(route('inventory.index'))
            ->assertSessionHasErrors('product_id');

        $this->assertDatabaseCount('stock_movements', 0);
        $this->assertSame(10, $product->fresh()->quantity);
    }

    public function test_stale_stock_out_attempt_cannot_make_inventory_negative(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 5,
            'status' => true,
        ]);

        $payload = [
            'product_id' => $product->id,
            'reason' => StockMovement::REASON_CUSTOMER_SALE,
        ];

        $this->actingAs($staff)
            ->post(route('inventory.stock-out.store'), $payload + ['quantity' => 4])
            ->assertRedirect();

        $this->actingAs($staff)
            ->from(route('inventory.index'))
            ->post(route('inventory.stock-out.store'), $payload + ['quantity' => 2])
            ->assertRedirect(route('inventory.index'))
            ->assertSessionHasErrors('quantity');

        $this->assertSame(1, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 1);
    }

    public function test_stock_out_quantity_must_be_positive(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create(['quantity' => 5]);

        $this->actingAs($staff)
            ->from(route('inventory.index'))
            ->post(route('inventory.stock-out.store'), [
                'product_id' => $product->id,
                'quantity' => 0,
                'reason' => StockMovement::REASON_CUSTOMER_SALE,
            ])
            ->assertSessionHasErrors('quantity');

        $this->assertSame(5, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_user_without_stock_out_permission_cannot_use_direct_route(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('inventory.view');
        $product = Product::factory()->create(['quantity' => 5]);

        $this->actingAs($user)
            ->post(route('inventory.stock-out.store'), [
                'product_id' => $product->id,
                'quantity' => 1,
                'reason' => StockMovement::REASON_CUSTOMER_SALE,
            ])
            ->assertForbidden();

        $this->assertSame(5, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_staff_only_sees_their_own_stock_out_movements(): void
    {
        $staff = $this->staff();
        $otherStaff = $this->staff();
        $product = Product::factory()->create();

        $ownMovement = $this->movement($product, $staff);
        $this->movement($product, $otherStaff);

        $this->actingAs($staff)
            ->get(route('inventory.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('movements', 1)
                ->where('movements.0.id', $ownMovement->id)
                ->where('movements.0.recorded_by', "{$staff->first_name} {$staff->last_name}")
            );
    }

    public function test_manager_sees_broader_stock_out_history(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $firstStaff = $this->staff();
        $secondStaff = $this->staff();
        $product = Product::factory()->create();

        $this->movement($product, $firstStaff);
        $this->movement($product, $secondStaff);

        $this->actingAs($manager)
            ->get(route('inventory.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('movements', 2));
    }

    public function test_stock_status_still_reflects_quantity_after_stock_out(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'name' => 'Threshold Product',
            'quantity' => 6,
            'minimum_stock' => 5,
            'status' => true,
        ]);

        $this->actingAs($staff)->post(route('inventory.stock-out.store'), [
            'product_id' => $product->id,
            'quantity' => 1,
            'reason' => StockMovement::REASON_CUSTOMER_SALE,
        ])->assertRedirect();

        $this->actingAs($staff)
            ->get(route('inventory.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('items.0.name', 'Threshold Product')
                ->where('items.0.quantity', 5)
                ->where('items.0.stock_status', 'low_stock')
            );
    }

    private function staff(): User
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');

        return $staff;
    }

    private function movement(Product $product, User $user): StockMovement
    {
        return StockMovement::query()->create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'quantity' => 1,
            'type' => StockMovement::TYPE_STOCK_OUT,
            'reason' => StockMovement::REASON_CUSTOMER_SALE,
        ]);
    }
}
