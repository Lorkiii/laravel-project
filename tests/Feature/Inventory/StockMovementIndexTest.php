<?php

namespace Tests\Feature\Inventory;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StockMovementIndexTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_staff_only_sees_their_own_stock_movements(): void
    {
        $staff = $this->staff();
        $otherStaff = $this->staff();
        $product = Product::factory()->create();

        $ownMovement = $this->movement($product, $staff, StockMovement::TYPE_STOCK_OUT);
        $this->movement($product, $otherStaff, StockMovement::TYPE_STOCK_OUT);

        $this->actingAs($staff)
            ->get(route('stock-movements.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('StockMovements/Index')
                ->has('movements', 1)
                ->where('movements.0.id', $ownMovement->id)
                ->where('movements.0.recorded_by', "{$staff->first_name} {$staff->last_name}")
                ->where('canAdjust', false)
                ->missing('filters')
            );
    }

    public function test_manager_receives_all_movement_types_in_one_payload(): void
    {
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $firstStaff = $this->staff();
        $secondStaff = $this->staff();
        $product = Product::factory()->create();

        $this->movement($product, $firstStaff, StockMovement::TYPE_STOCK_IN);
        $this->movement($product, $secondStaff, StockMovement::TYPE_STOCK_OUT);
        $this->movement($product, $manager, StockMovement::TYPE_ADJUSTMENT, -2);

        $this->actingAs($manager)
            ->get(route('stock-movements.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('movements', 3)
                ->where('canAdjust', true)
                ->where('movements', fn ($movements) => collect($movements)
                    ->pluck('type')
                    ->sort()
                    ->values()
                    ->all() === [
                        StockMovement::TYPE_ADJUSTMENT,
                        StockMovement::TYPE_STOCK_IN,
                        StockMovement::TYPE_STOCK_OUT,
                    ])
            );
    }

    public function test_staff_never_receive_adjustment_movements_in_payload(): void
    {
        $staff = $this->staff();
        $manager = User::factory()->create();
        $manager->assignRole('Manager');
        $product = Product::factory()->create();

        $ownOut = $this->movement($product, $staff, StockMovement::TYPE_STOCK_OUT);
        $this->movement($product, $manager, StockMovement::TYPE_ADJUSTMENT, -1);

        $this->actingAs($staff)
            ->get(route('stock-movements.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('movements', 1)
                ->where('movements.0.id', $ownOut->id)
                ->where('movements.0.type', StockMovement::TYPE_STOCK_OUT)
                ->where('canAdjust', false)
            );
    }

    public function test_user_without_view_movements_permission_cannot_access_page(): void
    {
        $user = User::factory()->create();
        $user->givePermissionTo('inventory.view');

        $this->actingAs($user)
            ->get(route('stock-movements.index'))
            ->assertForbidden();
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
