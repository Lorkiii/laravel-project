<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    private const RECENT_MOVEMENTS_LIMIT = 10;

    public function index(): Response
    {
        $items = Product::query()
            ->with('category:id,name')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'sku',
                'category_id',
                'quantity',
                'minimum_stock',
                'status',
            ])
            ->map(fn (Product $product) => $this->inventoryItem($product));

        return Inertia::render('Inventory/Index', [
            'items' => $items,
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load('category:id,name');

        $movements = $product->stockMovements()
            ->with('user:id,first_name,last_name')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(self::RECENT_MOVEMENTS_LIMIT)
            ->get()
            ->map(fn (StockMovement $movement) => $this->movementPayload($product, $movement));

        return Inertia::render('Inventory/Show', [
            'item' => $this->inventoryItem($product),
            'movements' => $movements,
        ]);
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     sku: string,
     *     category: string,
     *     quantity: int,
     *     minimum_stock: float,
     *     is_active: bool,
     *     stock_status: string
     * }
     */
    private function inventoryItem(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'category' => $product->category?->name ?? '',
            'quantity' => (int) $product->quantity,
            'minimum_stock' => (float) $product->minimum_stock,
            'is_active' => (bool) $product->status,
            'stock_status' => $product->stockStatus(),
        ];
    }

    /**
     * @return array{
     *     id: int,
     *     product: array{name: string, sku: string},
     *     type: string,
     *     quantity: int,
     *     reason: string|null,
     *     reference: string|null,
     *     notes: string|null,
     *     recorded_by: string,
     *     created_at: string
     * }
     */
    private function movementPayload(Product $product, StockMovement $movement): array
    {
        return [
            'id' => $movement->id,
            'product' => [
                'name' => $product->name,
                'sku' => $product->sku,
            ],
            'type' => $movement->type,
            'quantity' => (int) $movement->quantity,
            'reason' => $movement->reason,
            'reference' => $movement->reference,
            'notes' => $movement->remarks,
            'recorded_by' => trim(
                "{$movement->user->first_name} {$movement->user->last_name}",
            ),
            'created_at' => $movement->created_at->format('M j, Y g:i A'),
        ];
    }
}
