<?php

namespace Tests\Feature\Product;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_are_redirected_from_products_index(): void
    {
        $this->get(route('products.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_products_index(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Product/Index')
            );
    }

    public function test_product_index_includes_data_required_by_the_details_modal(): void
    {
        $creator = User::factory()->create([
            'first_name' => 'Taylor',
            'last_name' => 'Admin',
            'username' => 'taylor',
        ]);
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $category = Category::factory()->create(['name' => 'Accessories']);
        Product::factory()->for($category)->create([
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
            ->get(route('products.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Product/Index')
                ->where('products.0.name', 'Wireless Keyboard')
                ->where('products.0.sku', 'ACC-LOGITECH-K6')
                ->where('products.0.category', 'Accessories')
                ->where('products.0.brand', 'Logitech')
                ->where('products.0.model', 'K6')
                ->where('products.0.description', 'A compact keyboard')
                ->where('products.0.price', 49.99)
                ->where('products.0.quantity', 10)
                ->where('products.0.minimum_stock', 2)
                ->where('products.0.status', 'active')
                ->where('products.0.creator.name', 'Taylor Admin')
                ->where('products.0.creator.username', 'taylor')
                ->has('products.0.created_at')
                ->has('products.0.updated_at')
            );
    }

    public function test_view_only_user_cannot_access_product_create(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Warehouse Staff');

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertOk();

        $this->actingAs($user)
            ->get(route('products.create'))
            ->assertForbidden();
    }

    public function test_authenticated_user_without_product_permission_cannot_access_products(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);

        $this->actingAs($user)
            ->get(route('products.index'))
            ->assertForbidden();
    }

    public function test_guests_are_redirected_from_product_create(): void
    {
        $this->get(route('products.create'))->assertRedirect(route('login'));
    }
}
