<?php

namespace Tests\Feature\Product;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductShowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_can_view_all_product_details_and_creator_metadata(): void
    {
        $creator = User::factory()->create([
            'first_name' => 'Taylor',
            'last_name' => 'Admin',
            'username' => 'taylor',
        ]);
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $category = Category::factory()->create(['name' => 'Accessories']);
        $product = Product::factory()->for($category)->create([
            'name' => 'Wireless Keyboard',
            'sku' => 'ACC-LOGITECH-K6',
            'brand' => 'Logitech',
            'model' => 'K6',
            'description' => 'A compact keyboard',
            'price' => 49.99,
            'quantity' => 10,
            'minimum_stock' => 2,
            'status' => true,
            'created_by' => $creator->id,
        ]);

        $this->actingAs($staff)
            ->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Product/Show')
                ->where('product.name', 'Wireless Keyboard')
                ->where('product.sku', 'ACC-LOGITECH-K6')
                ->where('product.category', 'Accessories')
                ->where('product.brand', 'Logitech')
                ->where('product.model', 'K6')
                ->where('product.description', 'A compact keyboard')
                ->where('product.price', 49.99)
                ->where('product.quantity', 10)
                ->where('product.minimum_stock', 2)
                ->where('product.status', 'active')
                ->where('product.creator.name', 'Taylor Admin')
                ->where('product.creator.username', 'taylor')
                ->has('product.created_at')
                ->has('product.updated_at')
            );
    }

    public function test_product_details_handle_legacy_records_without_a_creator(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $product = Product::factory()->create(['created_by' => null]);

        $this->actingAs($staff)
            ->get(route('products.show', $product))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('product.creator', null)
            );
    }

    public function test_user_without_product_view_permission_cannot_view_details(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $this->actingAs($user)
            ->get(route('products.show', $product))
            ->assertForbidden();
    }
}
