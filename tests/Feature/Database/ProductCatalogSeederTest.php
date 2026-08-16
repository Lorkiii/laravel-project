<?php

namespace Tests\Feature\Database;

use App\Models\AuditEvent;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\ProductCatalogSeeder;
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

        $this->assertDatabaseCount('categories', 4);
        $this->assertDatabaseCount('products', 16);
        $this->assertSame(16, Product::query()->distinct()->count('sku'));
        $this->assertSame(
            16,
            Product::query()->where('created_by', $administratorId)->count(),
        );
        $this->assertSame(
            4,
            Category::query()->where('created_by', $administratorId)->count(),
        );
        $this->assertDatabaseHas('products', [
            'sku' => 'LPTP-DELL-3511',
            'quantity' => 0,
        ]);
        $this->assertDatabaseHas('products', [
            'sku' => 'LPTP-ASUS-A16',
            'category_id' => Category::query()->where('code', 'LPTP')->value('id'),
        ]);
        $this->assertSame(
            4,
            AuditEvent::query()
                ->where('action', AuditEvent::ACTION_CREATED)
                ->where('subject_type', AuditEvent::SUBJECT_CATEGORY)
                ->count(),
        );
        $this->assertSame(
            16,
            AuditEvent::query()
                ->where('action', AuditEvent::ACTION_CREATED)
                ->where('subject_type', AuditEvent::SUBJECT_PRODUCT)
                ->count(),
        );
        $this->assertSame(
            $administratorId,
            AuditEvent::query()->where('subject_type', AuditEvent::SUBJECT_PRODUCT)->value('actor_id'),
        );
    }

    public function test_existing_categories_are_not_created_again(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
        ]);

        Category::factory()->create([
            'code' => 'LPTP',
            'name' => 'LAPTOP',
        ]);
        Category::factory()->create([
            'code' => 'KYBD',
            'name' => 'Keyboard',
        ]);

        $this->seed(ProductCatalogSeeder::class);
        $this->seed(ProductCatalogSeeder::class);

        $this->assertDatabaseCount('categories', 2);
        $this->assertDatabaseMissing('categories', ['code' => 'EARPH']);
        $this->assertDatabaseMissing('categories', ['code' => 'MOU']);
        $this->assertDatabaseCount('products', 8);
        $this->assertSame(4, Product::query()->whereHas('category', fn ($query) => $query->where('code', 'LPTP'))->count());
        $this->assertSame(4, Product::query()->whereHas('category', fn ($query) => $query->where('code', 'KYBD'))->count());
        $this->assertSame(
            0,
            AuditEvent::query()
                ->where('subject_type', AuditEvent::SUBJECT_CATEGORY)
                ->count(),
        );
        $this->assertSame(
            8,
            AuditEvent::query()
                ->where('action', AuditEvent::ACTION_CREATED)
                ->where('subject_type', AuditEvent::SUBJECT_PRODUCT)
                ->count(),
        );
    }

    public function test_existing_products_are_not_overwritten_on_reseed(): void
    {
        $this->seed(DatabaseSeeder::class);

        $product = Product::query()->where('sku', 'LPTP-LENOVO-E14')->firstOrFail();
        $product->update(['quantity' => 99]);

        $this->seed(ProductCatalogSeeder::class);

        $this->assertSame(99, (int) $product->fresh()->quantity);
        $this->assertDatabaseCount('categories', 4);
        $this->assertDatabaseCount('products', 16);
    }
}
