<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StockInTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_can_record_stock_in(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 4,
            'status' => true,
        ]);

        $this->actingAs($staff)
            ->post(route('stock-movements.stock-in.store'), [
                'product_id' => $product->id,
                'quantity' => 6,
                'reason' => StockMovement::REASON_PURCHASE,
                'reference' => 'PO-221',
                'notes' => 'Received from supplier.',
            ])
            ->assertRedirect(route('stock-movements.index'));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'quantity' => 10,
        ]);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id,
            'user_id' => $staff->id,
            'quantity' => 6,
            'type' => StockMovement::TYPE_STOCK_IN,
            'reason' => StockMovement::REASON_PURCHASE,
            'reference' => 'PO-221',
            'remarks' => 'Received from supplier.',
        ]);
    }

    public function test_inactive_product_cannot_receive_stock_in(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 4,
            'status' => false,
        ]);

        $this->actingAs($staff)
            ->from(route('stock-movements.stock-in.create'))
            ->post(route('stock-movements.stock-in.store'), [
                'product_id' => $product->id,
                'quantity' => 2,
                'reason' => StockMovement::REASON_PURCHASE,
            ])
            ->assertRedirect(route('stock-movements.stock-in.create'))
            ->assertSessionHasErrors('product_id');

        $this->assertSame(4, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_stock_in_quantity_must_be_positive(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create(['quantity' => 4]);

        $this->actingAs($staff)
            ->from(route('stock-movements.stock-in.create'))
            ->post(route('stock-movements.stock-in.store'), [
                'product_id' => $product->id,
                'quantity' => 0,
                'reason' => StockMovement::REASON_PURCHASE,
            ])
            ->assertSessionHasErrors('quantity');

        $this->assertSame(4, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_user_without_stock_in_permission_cannot_use_direct_route(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo(['inventory.view', 'inventory.view_movements']);
        $product = Product::factory()->create(['quantity' => 4]);

        $this->actingAs($user)
            ->post(route('stock-movements.stock-in.store'), [
                'product_id' => $product->id,
                'quantity' => 1,
                'reason' => StockMovement::REASON_PURCHASE,
            ])
            ->assertForbidden();

        $this->assertSame(4, $product->fresh()->quantity);
        $this->assertDatabaseCount('stock_movements', 0);
    }

    public function test_staff_can_open_stock_in_form(): void
    {
        $staff = $this->staff();

        $this->actingAs($staff)
            ->get(route('stock-movements.stock-in.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('StockMovements/StockIn')
                ->has('products')
                ->has('reasons')
            );
    }

    private function staff(): User
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');

        return $staff;
    }
}
