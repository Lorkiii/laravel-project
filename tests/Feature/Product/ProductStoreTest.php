<?php

namespace Tests\Feature\Product;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_guests_cannot_store_products(): void
    {
        $category = Category::query()->create([
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => null,
        ]);

        $this->post(route('products.store'), [
            'name' => 'Wireless Keyboard',
            'category_id' => $category->id,
            'brand' => 'Logitech',
            'model' => 'K6',
            'description' => 'A compact keyboard',
            'price' => 49.99,
            'quantity' => 10,
            'minimum_stock' => 2,
            'status' => true,
        ])->assertRedirect(route('login'));
    }

    public function test_users_without_permission_cannot_store_products(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Warehouse Staff');

        $category = Category::query()->create([
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => null,
        ]);

        $this->actingAs($user)
            ->post(route('products.store'), [
                'name' => 'Wireless Keyboard',
                'category_id' => $category->id,
                'brand' => 'Logitech',
                'model' => 'K6',
                'description' => 'A compact keyboard',
                'price' => 49.99,
                'quantity' => 10,
                'minimum_stock' => 2,
                'status' => true,
            ])
            ->assertForbidden();
    }

    public function test_authenticated_user_can_store_a_product(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $category = Category::query()->create([
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => null,
        ]);

        $this->actingAs($user)
            ->post(route('products.store'), [
                'name' => 'Wireless Keyboard',
                'category_id' => $category->id,
                'brand' => 'Logitech',
                'model' => 'K6',
                'description' => 'A compact keyboard',
                'price' => 49.99,
                'quantity' => 10,
                'minimum_stock' => 2,
                'status' => true,
            ])
            ->assertRedirect(route('products.index'))
            ->assertInertiaFlash('successModal', [
                'title' => 'Product created',
                'description' => 'Your product was added successfully.',
            ]);

        $this->assertDatabaseHas('products', [
            'name' => 'Wireless Keyboard',
            'sku' => 'ACC-LOGITECH-K6',
            'category_id' => $category->id,
            'brand' => 'Logitech',
            'model' => 'K6',
            'description' => 'A compact keyboard',
            'quantity' => 10,
            'status' => 1,
            'created_by' => $user->id,
        ]);
    }

    public function test_generated_sku_uses_full_category_code_brand_and_model(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $category = Category::query()->create([
            'name' => 'Laptop',
            'code' => 'LPTP',
            'description' => null,
        ]);

        $this->actingAs($user)
            ->post(route('products.store'), [
                'name' => 'Gaming Laptop',
                'category_id' => $category->id,
                'brand' => 'Asus',
                'model' => 'fa617ns',
                'description' => 'A gaming laptop',
                'price' => 1299.99,
                'quantity' => 3,
                'minimum_stock' => 1,
                'status' => true,
            ])
            ->assertRedirect(route('products.index'));

        $this->assertDatabaseHas('products', [
            'name' => 'Gaming Laptop',
            'sku' => 'LPTP-ASUS-FA617NS',
            'category_id' => $category->id,
        ]);
    }

    public function test_generated_sku_gets_unique_suffix_on_collision(): void
    {
        $user = User::factory()->create([
            'is_active' => true,
        ]);
        $user->assignRole('Manager');

        $category = Category::query()->create([
            'name' => 'Accessories',
            'code' => 'ACC',
            'description' => null,
        ]);

        Product::query()->create([
            'name' => 'Wireless Keyboard',
            'sku' => 'ACC-LOGITECH-K6',
            'category_id' => $category->id,
            'brand' => 'Logitech',
            'model' => 'K6',
            'description' => 'Existing product',
            'price' => 39.99,
            'quantity' => 5,
            'minimum_stock' => 1,
            'status' => true,
        ]);

        $this->actingAs($user)
            ->post(route('products.store'), [
                'name' => 'Wireless Keyboard',
                'category_id' => $category->id,
                'brand' => 'Logitech',
                'model' => 'K6',
                'description' => 'A compact keyboard',
                'price' => 49.99,
                'quantity' => 10,
                'minimum_stock' => 2,
                'status' => true,
            ])
            ->assertRedirect(route('products.index'));

        $this->assertDatabaseHas('products', [
            'name' => 'Wireless Keyboard',
            'sku' => 'ACC-LOGITECH-K6-2',
            'category_id' => $category->id,
        ]);
    }
}
