<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        $items = Product::query()
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'quantity', 'minimum_stock', 'status'])
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'quantity' => (int) $product->quantity,
                'minimum_stock' => (float) $product->minimum_stock,
                'is_active' => (bool) $product->status,
                'stock_status' => match (true) {
                    $product->quantity === 0 => 'out_of_stock',
                    $product->quantity <= $product->minimum_stock => 'low_stock',
                    default => 'in_stock',
                },
            ]);

        return Inertia::render('Inventory/Index', [
            'items' => $items,
        ]);
    }
}
