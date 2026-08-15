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

class InventoryIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_can_view_inventory_with_consistent_stock_statuses(): void
    {
        $staff = $this->staff();
        $category = Category::factory()->create(['name' => 'Accessories']);

        Product::factory()->for($category)->create([
            'name' => 'Available Product',
            'sku' => 'TEST-IN',
            'quantity' => 11,
            'minimum_stock' => 10,
        ]);
        Product::factory()->for($category)->create([
            'name' => 'Low Product',
            'sku' => 'TEST-LOW',
            'quantity' => 5,
            'minimum_stock' => 5,
        ]);
        Product::factory()->for($category)->create([
            'name' => 'Empty Product',
            'sku' => 'TEST-OUT',
            'quantity' => 0,
            'minimum_stock' => 5,
        ]);

        $this->actingAs($staff)
            ->get(route('inventory.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Inventory/Index')
                ->has('items', 3)
                ->missing('canStockOut')
                ->where('items.0.name', 'Available Product')
                ->where('items.0.sku', 'TEST-IN')
                ->where('items.0.category', 'Accessories')
                ->where('items.0.quantity', 11)
                ->where('items.0.minimum_stock', 10)
                ->where('items.0.stock_status', 'in_stock')
                ->where('items.0.movements', [])
                ->where('items.1.stock_status', 'out_of_stock')
                ->where('items.2.stock_status', 'low_stock')
            );
    }

    public function test_inventory_details_include_recent_stock_movements(): void
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
            ->get(route('inventory.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Inventory/Index')
                ->has('items', 1)
                ->where('items.0.name', 'Asus A16')
                ->where('items.0.sku', 'LAP-ASUS-A16')
                ->where('items.0.quantity', 40)
                ->where('items.0.minimum_stock', 10)
                ->where('items.0.stock_status', 'in_stock')
                ->has('items.0.movements', 2)
                ->where('items.0.movements.0.id', $newer->id)
                ->where('items.0.movements.0.type', StockMovement::TYPE_STOCK_OUT)
                ->where('items.0.movements.0.quantity', 5)
                ->where('items.0.movements.0.recorded_by', "{$manager->first_name} {$manager->last_name}")
                ->where('items.0.movements.1.id', $older->id)
            );
    }

    public function test_inventory_details_limit_recent_movements_to_eight(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 8,
            'minimum_stock' => 10,
        ]);

        foreach (range(1, 9) as $index) {
            $this->movement($product, $staff, StockMovement::TYPE_STOCK_IN, $index);
        }

        $this->actingAs($staff)
            ->get(route('inventory.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('items.0.stock_status', 'low_stock')
                ->has('items.0.movements', 8)
            );
    }

    public function test_user_without_inventory_permission_cannot_access_inventory(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('inventory.index'))
            ->assertForbidden();
    }

    public function test_removed_inventory_details_page_is_not_available(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create();

        $this->actingAs($staff)
            ->get('/inventory/'.$product->id)
            ->assertNotFound();
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
