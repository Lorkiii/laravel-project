<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
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
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');

        Product::factory()->create([
            'name' => 'Available Product',
            'sku' => 'TEST-IN',
            'quantity' => 11,
            'minimum_stock' => 10,
        ]);
        Product::factory()->create([
            'name' => 'Low Product',
            'sku' => 'TEST-LOW',
            'quantity' => 5,
            'minimum_stock' => 5,
        ]);
        Product::factory()->create([
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
                ->where('items.0.name', 'Available Product')
                ->where('items.0.sku', 'TEST-IN')
                ->where('items.0.quantity', 11)
                ->where('items.0.minimum_stock', 10)
                ->where('items.0.stock_status', 'in_stock')
                ->where('items.1.stock_status', 'out_of_stock')
                ->where('items.2.stock_status', 'low_stock')
            );
    }

    public function test_user_without_inventory_permission_cannot_access_inventory(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('inventory.index'))
            ->assertForbidden();
    }
}
