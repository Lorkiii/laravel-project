<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreStockAdjustmentRequest;
use App\Http\Requests\Inventory\StoreStockInRequest;
use App\Http\Requests\Inventory\StoreStockOutRequest;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    public function index(Request $request): Response
    {
        $canAdjust = $request->user()->can('inventory.adjust');

        $movements = StockMovement::query()
            ->with([
                'product:id,name,sku',
                'user:id,first_name,last_name',
            ])
            ->when(
                ! $canAdjust,
                fn ($query) => $query->where('user_id', $request->user()->id),
            )
            ->when(
                ! $canAdjust,
                fn ($query) => $query->whereIn('type', [
                    StockMovement::TYPE_STOCK_IN,
                    StockMovement::TYPE_STOCK_OUT,
                ]),
            )
            ->latest()
            ->limit(200)
            ->get()
            ->map(fn (StockMovement $movement) => $this->movementPayload($movement));

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'canStockIn' => $request->user()->can('inventory.stock_in'),
            'canStockOut' => $request->user()->can('inventory.stock_out'),
            'canAdjust' => $canAdjust,
        ]);
    }

    public function createStockIn(Request $request): Response
    {
        return Inertia::render('StockMovements/StockIn', [
            'products' => $this->activeProductOptions(),
            'reasons' => StockMovement::STOCK_IN_REASONS,
            'selectedProductId' => $request->integer('product_id') ?: null,
        ]);
    }

    public function storeStockIn(StoreStockInRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $quantity = (int) $validated['quantity'];

        DB::transaction(function () use ($request, $validated, $quantity): void {
            $product = Product::query()
                ->lockForUpdate()
                ->findOrFail($validated['product_id']);

            if (! $product->status) {
                throw ValidationException::withMessages([
                    'product_id' => 'Stock in is only available for active products.',
                ]);
            }

            $product->quantity += $quantity;
            $product->save();

            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'quantity' => $quantity,
                'type' => StockMovement::TYPE_STOCK_IN,
                'reason' => $validated['reason'],
                'reference' => $validated['reference'] ?? null,
                'remarks' => $validated['notes'] ?? null,
            ]);
        }, attempts: 3);

        Inertia::flash('successModal', [
            'title' => 'Stock in recorded',
            'description' => 'Inventory and stock movement history were updated successfully.',
        ]);

        return redirect()->route('stock-movements.index');
    }

    public function createStockOut(Request $request): Response
    {
        return Inertia::render('StockMovements/StockOut', [
            'products' => $this->activeProductOptions(requireStock: true),
            'reasons' => StockMovement::STOCK_OUT_REASONS,
            'selectedProductId' => $request->integer('product_id') ?: null,
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

        return redirect()->route('stock-movements.index');
    }

    public function createAdjustment(Request $request): Response
    {
        return Inertia::render('StockMovements/Adjustment', [
            'products' => $this->activeProductOptions(),
            'reasons' => StockMovement::ADJUSTMENT_REASONS,
            'selectedProductId' => $request->integer('product_id') ?: null,
        ]);
    }

    public function storeAdjustment(StoreStockAdjustmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $physicalCount = (int) $validated['physical_count'];

        DB::transaction(function () use ($request, $validated, $physicalCount): void {
            $product = Product::query()
                ->lockForUpdate()
                ->findOrFail($validated['product_id']);

            if (! $product->status) {
                throw ValidationException::withMessages([
                    'product_id' => 'Stock adjustment is only available for active products.',
                ]);
            }

            $delta = $physicalCount - (int) $product->quantity;

            if ($delta === 0) {
                throw ValidationException::withMessages([
                    'physical_count' => 'Physical count matches current stock. No adjustment needed.',
                ]);
            }

            $product->quantity = $physicalCount;
            $product->save();

            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => $request->user()->id,
                'quantity' => $delta,
                'type' => StockMovement::TYPE_ADJUSTMENT,
                'reason' => $validated['reason'],
                'reference' => $validated['reference'] ?? null,
                'remarks' => $validated['notes'] ?? null,
            ]);
        }, attempts: 3);

        Inertia::flash('successModal', [
            'title' => 'Stock adjustment recorded',
            'description' => 'Inventory and stock movement history were updated successfully.',
        ]);

        return redirect()->route('stock-movements.index');
    }

    /**
     * @return list<array{id: int, name: string, sku: string, quantity: int, is_active: bool}>
     */
    private function activeProductOptions(bool $requireStock = false): array
    {
        return Product::query()
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'quantity', 'status'])
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'quantity' => (int) $product->quantity,
                'is_active' => (bool) $product->status,
                'selectable' => $product->status && (! $requireStock || $product->quantity > 0),
            ])
            ->all();
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
    private function movementPayload(StockMovement $movement): array
    {
        return [
            'id' => $movement->id,
            'product' => [
                'name' => $movement->product->name,
                'sku' => $movement->product->sku,
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
