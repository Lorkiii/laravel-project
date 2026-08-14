<?php

namespace Tests\Feature\Inventory;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InventoryShowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_can_view_read_only_inventory_details_with_recent_movements(): void
    {
        $staff = $this->staff();
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $category = Category::factory()->create(['name' => 'Laptops']);
        $product = Product::factory()->for($category)->create([
            'name' => 'Asus A16',
            'sku' => 'LAP-ASUS-A16',
            'quantity' => 40,
            'minimum_stock' => 10,
            'status' => true,
        ]);

        $older = $this->movement($product, $staff, StockMovement::TYPE_STOCK_IN, 20);
        $older->forceFill(['created_at' => now()->subHour()])->save();
        $newer = $this->movement($product, $manager, StockMovement::TYPE_STOCK_OUT, 5);

        $this->actingAs($staff)
            ->get(route('inventory.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Inventory/Show')
                ->where('item.name', 'Asus A16')
                ->where('item.sku', 'LAP-ASUS-A16')
                ->where('item.quantity', 40)
                ->where('item.minimum_stock', 10)
                ->where('item.stock_status', 'in_stock')
                ->missing('canStockIn')
                ->missing('canStockOut')
                ->missing('canAdjust')
                ->has('movements', 2)
                ->where('movements.0.id', $newer->id)
                ->where('movements.0.type', StockMovement::TYPE_STOCK_OUT)
                ->where('movements.0.quantity', 5)
                ->where('movements.0.recorded_by', "{$manager->first_name} {$manager->last_name}")
                ->where('movements.1.id', $older->id)
            );
    }

    public function test_inventory_details_limit_recent_movements_to_ten(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 8,
            'minimum_stock' => 10,
        ]);

        foreach (range(1, 11) as $index) {
            $this->movement($product, $staff, StockMovement::TYPE_STOCK_IN, $index);
        }

        $this->actingAs($staff)
            ->get(route('inventory.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('item.stock_status', 'low_stock')
                ->has('movements', 10)
            );
    }

    public function test_out_of_stock_status_is_used_when_quantity_is_zero(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 0,
            'minimum_stock' => 0,
        ]);

        $this->actingAs($staff)
            ->get(route('inventory.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('item.stock_status', 'out_of_stock')
            );
    }

    public function test_user_without_inventory_permission_cannot_view_details(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user)
            ->get(route('inventory.show', $product))
            ->assertForbidden();
    }

    public function test_guests_are_redirected_from_inventory_details(): void
    {
        $product = Product::factory()->create();

        $this->get(route('inventory.show', $product))
            ->assertRedirect(route('login'));
    }

    private function staff(): User
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');

        return $staff;
    }

    private function movement(
        Product $product,
        User $user,
        string $type,
        int $quantity = 1,
    ): StockMovement {
        $reason = match ($type) {
            StockMovement::TYPE_STOCK_IN => StockMovement::REASON_PURCHASE,
            StockMovement::TYPE_ADJUSTMENT => StockMovement::REASON_CYCLE_COUNT,
            default => StockMovement::REASON_CUSTOMER_SALE,
        };

        return StockMovement::query()->create([
            'product_id' => $product->id,
            'user_id' => $user->id,
            'quantity' => $quantity,
            'type' => $type,
            'reason' => $reason,
        ]);
    }
}
