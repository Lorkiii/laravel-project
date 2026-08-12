<?php

namespace Tests\Feature\Product;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_cannot_create_edit_update_or_delete_products(): void
    {
        $staff = User::factory()->create();
        $staff->assignRole('Warehouse Staff');
        $product = Product::factory()->create();

        $this->actingAs($staff)
            ->get(route('products.create'))
            ->assertForbidden();
        $this->actingAs($staff)
            ->get(route('products.edit', $product))
            ->assertForbidden();
        $this->actingAs($staff)
            ->put(route('products.update', $product), $this->validProductData($product->category))
            ->assertForbidden();
        $this->actingAs($staff)
            ->delete(route('products.destroy', $product))
            ->assertForbidden();

        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_manager_can_edit_and_update_but_cannot_delete_products(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $product = Product::factory()->create();

        $this->actingAs($manager)
            ->get(route('products.edit', $product))
            ->assertOk();

        $this->actingAs($manager)
            ->put(route('products.update', $product), [
                ...$this->validProductData($product->category),
                'name' => 'Updated Product',
            ])
            ->assertRedirect(route('products.show', $product));

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
        ]);

        $this->actingAs($manager)
            ->delete(route('products.destroy', $product))
            ->assertForbidden();
    }

    public function test_administrator_can_delete_products(): void
    {
        $administrator = User::factory()->create();
        $administrator->assignRole('Administrator');
        $product = Product::factory()->create();

        $this->actingAs($administrator)
            ->delete(route('products.destroy', $product))
            ->assertRedirect(route('products.index'));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validProductData(Category $category): array
    {
        return [
            'name' => 'Product',
            'category_id' => $category->id,
            'brand' => 'Brand',
            'model' => 'Model',
            'description' => 'Description',
            'price' => 99.99,
            'quantity' => 10,
            'minimum_stock' => 2,
            'status' => true,
        ];
    }
}
