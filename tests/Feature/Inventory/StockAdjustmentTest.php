<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StockAdjustmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_manager_can_record_stock_adjustment(): void
    {
        $manager = $this->manager();
        $product = Product::factory()->create([
            'quantity' => 10,
            'status' => true,
        ]);

        $this->actingAs($manager)
            ->post(route('stock-movements.adjustment.store'), [
                'product_id' => $product->id,
                'physical_count' => 7,
                'reason' => StockMovement::REASON_CYCLE_COUNT,
                'notes' => 'Shelf count correction.',
            ])
            ->assertRedirect(route('stock-movements.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 7,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'user_id' => $manager->id,
            'quantity' => -3,
            'type' => StockMovement::TYPE_ADJUSTMENT,
            'reason' => StockMovement::REASON_CYCLE_COUNT,
            'remarks' => 'Shelf count correction.',
        ]);
    }

    public function test_admin_can_increase_stock_via_adjustment(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');
        $product = Product::factory()->create([
            'quantity' => 2,
            'status' => true,
        ]);

        $this->actingAs($admin)
            ->post(route('stock-movements.adjustment.store'), [
                'product_id' => $product->id,
                'physical_count' => 5,
                'reason' => StockMovement::REASON_CORRECTION,
            ])
            ->assertRedirect(route('stock-movements.index'));

        $this->assertSame(5, $product->fresh()->quantity);
        $this->assertDatabaseHas('stock_movements', [
            'type' => StockMovement::TYPE_ADJUSTMENT,
            'quantity' => 3,
        ]);
    }

    public function test_staff_cannot_perform_stock_adjustment(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $product = Product::factory()->create([
            'quantity' => 10,
            'status' => true,
        ]);

        $this->actingAs($staff)
            ->post(route('stock-movements.adjustment.store'), [
                'product_id' => $product->id,
                'physical_count' => 8,
                'reason' => StockMovement::REASON_CYCLE_COUNT,
            ])
            ->assertForbidden();

        $this->actingAs($staff)
            ->get(route('stock-movements.adjustment.create'))
            ->assertForbidden();

        $this->assertSame(10, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_adjustment_requires_a_different_physical_count(): void
    {
        $manager = $this->manager();
        $product = Product::factory()->create([
            'quantity' => 10,
            'status' => true,
        ]);

        $this->actingAs($manager)
            ->from(route('stock-movements.adjustment.create'))
            ->post(route('stock-movements.adjustment.store'), [
                'product_id' => $product->id,
                'physical_count' => 10,
                'reason' => StockMovement::REASON_CYCLE_COUNT,
            ])
            ->assertRedirect(route('stock-movements.adjustment.create'))
            ->assertSessionHasErrors('physical_count');

        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_inactive_product_cannot_be_adjusted(): void
    {
        $manager = $this->manager();
        $product = Product::factory()->create([
            'quantity' => 10,
            'status' => false,
        ]);

        $this->actingAs($manager)
            ->from(route('stock-movements.adjustment.create'))
            ->post(route('stock-movements.adjustment.store'), [
                'product_id' => $product->id,
                'physical_count' => 8,
                'reason' => StockMovement::REASON_CYCLE_COUNT,
            ])
            ->assertRedirect(route('stock-movements.adjustment.create'))
            ->assertSessionHasErrors('product_id');

        $this->assertSame(10, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_manager_can_open_adjustment_form(): void
    {
        $manager = $this->manager();

        $this->actingAs($manager)
            ->get(route('stock-movements.adjustment.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('StockMovements/Adjustment')
                ->has('products')
                ->has('reasons')
            );
    }

    private function manager(): User
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');

        return $manager;
    }
}
