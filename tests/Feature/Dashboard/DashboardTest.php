<?php

namespace Tests\Feature\Dashboard;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_dashboard_includes_informational_inventory_sections(): void
    {
        $staff = $this->staff();
        $otherStaff = $this->staff();
        $manager = User::factory()->create();
        $manager->assignRole('Manager');

        Product::factory()->create([
            'name' => 'Available Product',
            'sku' => 'DASH-IN',
            'quantity' => 20,
            'minimum_stock' => 5,
        ]);
        $lowProduct = Product::factory()->create([
            'name' => 'Low Product',
            'sku' => 'DASH-LOW',
            'quantity' => 3,
            'minimum_stock' => 5,
        ]);
        $outProduct = Product::factory()->create([
            'name' => 'Empty Product',
            'sku' => 'DASH-OUT',
            'quantity' => 0,
            'minimum_stock' => 4,
        ]);

        $ownIn = $this->movement($lowProduct, $staff, StockMovement::TYPE_STOCK_IN, 2);
        $ownOut = $this->movement($lowProduct, $staff, StockMovement::TYPE_STOCK_OUT, 1);
        $this->movement($lowProduct, $otherStaff, StockMovement::TYPE_STOCK_OUT, 1);
        $this->movement($outProduct, $manager, StockMovement::TYPE_ADJUSTMENT, -1);

        $this->actingAs($staff)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Dashboard')
                ->where('stats.products', 3)
                ->missing('stats.categories')
                ->where('stats.low_stock', 1)
                ->where('stats.movements_today', 4)
                ->where('stock_overview.total_quantity', 23)
                ->where('stock_overview.in_stock_count', 2)
                ->where('stock_overview.out_of_stock_count', 1)
                ->missing('stock_overview.total_products')
                ->missing('stock_overview.low_stock_count')
                ->has('stock_overview.trend', 7)
                ->where('stock_overview.trend.6.stock_in', 2)
                ->where('stock_overview.trend.6.stock_out', 2)
                ->missing('low_stock_items')
                ->has('attention_items', 2)
                ->where('attention_items.0.sku', 'DASH-OUT')
                ->where('attention_items.0.stock_status', 'out_of_stock')
                ->where('attention_items.1.sku', 'DASH-LOW')
                ->where('attention_items.1.stock_status', 'low_stock')
                ->has('recent_movements', 2)
                ->where('recent_movements.0.id', $ownOut->id)
                ->where('recent_movements.0.type', StockMovement::TYPE_STOCK_OUT)
                ->where('recent_movements.0.product.sku', 'DASH-LOW')
                ->where('recent_movements.0.recorded_by', "{$staff->first_name} {$staff->last_name}")
                ->where('recent_movements.1.id', $ownIn->id)
                ->missing('canCreate')
                ->missing('canEdit')
                ->missing('canDelete')
                ->missing('canAdjust')
            );
    }

    public function test_manager_dashboard_does_not_include_staff_sections(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        Product::factory()->create();

        $this->actingAs($manager)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Dashboard')
                ->where('stats.products', 1)
                ->missing('stats.categories')
                ->where('stock_overview', null)
                ->where('attention_items', null)
                ->missing('low_stock_items')
                ->where('recent_movements', null)
            );
    }

    public function test_administrator_dashboard_does_not_include_staff_sections(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $this->actingAs($admin)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Dashboard')
                ->missing('stats.categories')
                ->where('stock_overview', null)
                ->where('attention_items', null)
                ->missing('low_stock_items')
                ->where('recent_movements', null)
            );
    }

    public function test_staff_dashboard_shows_empty_stock_trend_without_movement_history(): void
    {
        $staff = $this->staff();
        Product::factory()->create([
            'quantity' => 12,
            'minimum_stock' => 4,
        ]);

        $this->actingAs($staff)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('stock_overview.total_quantity', 12)
                ->where('stock_overview.in_stock_count', 1)
                ->where('stock_overview.trend', [])
            );
    }

    public function test_staff_stock_trend_summarizes_daily_stock_in_and_stock_out(): void
    {
        $this->travelTo(now()->startOfDay()->addHours(15));

        $staff = $this->staff();
        $product = Product::factory()->create([
            'quantity' => 120,
            'minimum_stock' => 10,
        ]);

        $stockIn = $this->movement($product, $staff, StockMovement::TYPE_STOCK_IN, 40);
        $stockIn->forceFill([
            'created_at' => now()->subDays(4)->setTime(10, 0),
            'updated_at' => now()->subDays(4)->setTime(10, 0),
        ])->save();

        $stockOut = $this->movement($product, $staff, StockMovement::TYPE_STOCK_OUT, 20);
        $stockOut->forceFill([
            'created_at' => now()->subDays(2)->setTime(14, 0),
            'updated_at' => now()->subDays(2)->setTime(14, 0),
        ])->save();

        $this->actingAs($staff)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('stock_overview.trend', 7)
                ->where('stock_overview.trend.2.stock_in', 40)
                ->where('stock_overview.trend.2.stock_out', 0)
                ->where('stock_overview.trend.4.stock_in', 0)
                ->where('stock_overview.trend.4.stock_out', 20)
                ->where('stock_overview.trend.6.stock_in', 0)
                ->where('stock_overview.trend.6.stock_out', 0)
            );
    }

    public function test_staff_dashboard_limits_recent_movements_to_five(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create();

        foreach (range(1, 6) as $quantity) {
            $this->movement($product, $staff, StockMovement::TYPE_STOCK_IN, $quantity);
        }

        $this->actingAs($staff)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('recent_movements', 5)
            );
    }

    public function test_staff_dashboard_excludes_older_movements_from_today_count(): void
    {
        $staff = $this->staff();
        $product = Product::factory()->create();

        $this->movement($product, $staff, StockMovement::TYPE_STOCK_IN);
        $yesterday = $this->movement($product, $staff, StockMovement::TYPE_STOCK_OUT);
        $yesterday->forceFill([
            'created_at' => now()->subDay(),
            'updated_at' => now()->subDay(),
        ])->save();

        $this->actingAs($staff)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('stats.movements_today', 1)
                ->has('recent_movements', 2)
            );
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
