<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private const STAFF_MOVEMENTS_LIMIT = 5;

    private const STAFF_ATTENTION_LIMIT = 5;

    private const TREND_DAYS = 7;

    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isStaff = $user->hasRole('Warehouse Staff');

        if (! $isStaff) {
            return Inertia::render('Dashboard/Dashboard', [
                'stats' => $this->stats(),
                'stock_overview' => null,
                'attention_items' => null,
                'recent_movements' => null,
            ]);
        }

        $products = Product::query()->get([
            'id',
            'name',
            'sku',
            'quantity',
            'minimum_stock',
            'status',
        ]);
        $periodStart = now()->subDays(self::TREND_DAYS - 1)->startOfDay();
        $periodMovements = StockMovement::query()
            ->where('created_at', '>=', $periodStart)
            ->orderBy('created_at')
            ->get(['type', 'quantity', 'created_at']);

        $inStockCount = $products->filter(fn (Product $product): bool => $product->quantity > 0)->count();

        return Inertia::render('Dashboard/Dashboard', [
            'stats' => [
                'products' => $products->count(),
                'low_stock' => $products
                    ->filter(fn (Product $product): bool => $product->quantity > 0
                        && $product->quantity <= $product->minimum_stock)
                    ->count(),
                'movements_today' => $periodMovements
                    ->filter(fn (StockMovement $movement): bool => $movement->created_at->isToday())
                    ->count(),
            ],
            'stock_overview' => [
                'total_quantity' => (int) $products->sum('quantity'),
                'in_stock_count' => $inStockCount,
                'out_of_stock_count' => $products->where('quantity', 0)->count(),
                'trend' => $this->movementTrend($periodMovements, $periodStart),
            ],
            'attention_items' => $this->attentionItems($products),
            'recent_movements' => $this->recentMovements($user),
        ]);
    }

    /**
     * @return array{products: int, low_stock: int, movements_today: int}
     */
    private function stats(): array
    {
        return [
            'products' => Product::query()->count(),
            'low_stock' => Product::query()
                ->where('quantity', '>', 0)
                ->whereColumn('quantity', '<=', 'minimum_stock')
                ->count(),
            'movements_today' => StockMovement::query()
                ->whereDate('created_at', now()->toDateString())
                ->count(),
        ];
    }

    /**
     * @param  Collection<int, StockMovement>  $periodMovements
     * @return list<array{date: string, label: string, stock_in: int, stock_out: int}>
     */
    private function movementTrend(Collection $periodMovements, Carbon $periodStart): array
    {
        $inAndOut = $periodMovements->filter(
            fn (StockMovement $movement): bool => in_array($movement->type, [
                StockMovement::TYPE_STOCK_IN,
                StockMovement::TYPE_STOCK_OUT,
            ], true),
        );

        if ($inAndOut->isEmpty()) {
            return [];
        }

        $points = [];

        for ($day = 0; $day < self::TREND_DAYS; $day++) {
            $date = $periodStart->copy()->addDays($day);
            $dateString = $date->toDateString();
            $dayMovements = $inAndOut->filter(
                fn (StockMovement $movement): bool => $movement->created_at->toDateString() === $dateString,
            );

            $points[] = [
                'date' => $dateString,
                'label' => $date->format('M j'),
                'stock_in' => (int) $dayMovements
                    ->where('type', StockMovement::TYPE_STOCK_IN)
                    ->sum('quantity'),
                'stock_out' => (int) $dayMovements
                    ->where('type', StockMovement::TYPE_STOCK_OUT)
                    ->sum('quantity'),
            ];
        }

        return $points;
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return list<array{
     *     id: int,
     *     name: string,
     *     sku: string,
     *     quantity: int,
     *     minimum_stock: float,
     *     is_active: bool,
     *     stock_status: string
     * }>
     */
    private function attentionItems(Collection $products): array
    {
        return $products
            ->filter(fn (Product $product): bool => $product->status
                && $product->quantity <= $product->minimum_stock)
            ->sortBy(fn (Product $product): array => [
                $product->quantity === 0 ? 0 : 1,
                $product->quantity,
            ])
            ->take(self::STAFF_ATTENTION_LIMIT)
            ->values()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'quantity' => (int) $product->quantity,
                'minimum_stock' => (float) $product->minimum_stock,
                'is_active' => true,
                'stock_status' => match (true) {
                    $product->quantity === 0 => 'out_of_stock',
                    default => 'low_stock',
                },
            ])
            ->all();
    }

    /**
     * @return list<array{
     *     id: int,
     *     product: array{name: string, sku: string},
     *     type: string,
     *     quantity: int,
     *     reason: string|null,
     *     recorded_by: string,
     *     created_at: string
     * }>
     */
    private function recentMovements(User $user): array
    {
        return StockMovement::query()
            ->with([
                'product:id,name,sku',
                'user:id,first_name,last_name',
            ])
            ->where('user_id', $user->id)
            ->whereIn('type', [
                StockMovement::TYPE_STOCK_IN,
                StockMovement::TYPE_STOCK_OUT,
            ])
            ->latest()
            ->limit(self::STAFF_MOVEMENTS_LIMIT)
            ->get()
            ->map(fn (StockMovement $movement) => [
                'id' => $movement->id,
                'product' => [
                    'name' => $movement->product->name,
                    'sku' => $movement->product->sku,
                ],
                'type' => $movement->type,
                'quantity' => (int) $movement->quantity,
                'reason' => $movement->reason,
                'recorded_by' => trim(
                    "{$movement->user->first_name} {$movement->user->last_name}",
                ),
                'created_at' => $movement->created_at->format('M j, Y g:i A'),
            ])
            ->all();
    }
}
