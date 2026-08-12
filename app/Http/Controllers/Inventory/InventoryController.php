<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreStockOutRequest;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
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

        $movements = StockMovement::query()
            ->with([
                'product:id,name,sku',
                'user:id,first_name,last_name',
            ])
            ->where('type', StockMovement::TYPE_STOCK_OUT)
            ->when(
                ! $request->user()->can('inventory.adjust'),
                fn ($query) => $query->where('user_id', $request->user()->id),
            )
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn (StockMovement $movement) => [
                'id' => $movement->id,
                'product' => [
                    'name' => $movement->product->name,
                    'sku' => $movement->product->sku,
                ],
                'quantity' => (int) $movement->quantity,
                'reason' => $movement->reason,
                'reference' => $movement->reference,
                'notes' => $movement->remarks,
                'recorded_by' => trim(
                    "{$movement->user->first_name} {$movement->user->last_name}",
                ),
                'created_at' => $movement->created_at->format('M j, Y g:i A'),
            ]);

        return Inertia::render('Inventory/Index', [
            'items' => $items,
            'movements' => $movements,
            'stockOutReasons' => StockMovement::STOCK_OUT_REASONS,
        ]);
    }

    public function storeStockOut(StoreStockOutRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $quantity = (int) $validated['quantity'];

        DB::transaction(function () use ($request, $validated, $quantity): void {
            $product = Product::query()
                ->lockForUpdate()
                ->findOrFail($validated['product_id']);

            if (! $product->status) {
                throw ValidationException::withMessages([
                    'product_id' => 'Stock out is only available for active products.',
                ]);
            }

            if ($product->quantity < $quantity) {
                throw ValidationException::withMessages([
                    'quantity' => 'The quantity cannot exceed the available stock.',
                ]);
            }

            $product->quantity -= $quantity;
            $product->save();

            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'quantity' => $quantity,
                'type' => StockMovement::TYPE_STOCK_OUT,
                'reason' => $validated['reason'],
                'reference' => $validated['reference'] ?? null,
                'remarks' => $validated['notes'] ?? null,
            ]);
        }, attempts: 3);

        Inertia::flash('successModal', [
            'title' => 'Stock out recorded',
            'description' => 'Inventory and stock movement history were updated successfully.',
        ]);

        return redirect()->route('inventory.index');
    }
}
