<?php

namespace Tests\Feature\Database;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCatalogSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_seeding_is_predictable_and_repeatable(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $administratorId = User::query()
            ->where('email', 'admin@example.com')
            ->value('id');

        $this->assertDatabaseCount('categories', 5);
        $this->assertDatabaseCount('products', 20);
        $this->assertSame(20, Product::query()->distinct()->count('sku'));
        $this->assertSame(
            20,
            Product::query()->where('created_by', $administratorId)->count(),
        );
        $this->assertSame(
            5,
            Category::query()->where('created_by', $administratorId)->count(),
        );
        $this->assertDatabaseHas('products', [
            'sku' => 'COMP-DELL-7010M',
            'quantity' => 0,
        ]);
    }
}
