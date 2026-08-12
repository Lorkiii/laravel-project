<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with([
                'category:id,name',
                'creator:id,first_name,last_name,username',
            ])
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'sku',
                'category_id',
                'brand',
                'model',
                'description',
                'price',
                'quantity',
                'minimum_stock',
                'status',
                'created_by',
                'created_at',
                'updated_at',
            ])
            ->map(fn (Product $product) => $this->productDetails($product));

        return Inertia::render('Product/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Product/Create', [
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedProduct($request);

        $validated['brand'] = $validated['brand'] ?? '';
        $validated['model'] = $validated['model'] ?? '';
        $validated['sku'] = $this->generateSku(
            $validated['category_id'],
            $validated['brand'],
            $validated['model'],
        );
        $validated['created_by'] = $request->user()->id;

        Product::create($validated);

        Inertia::flash('successModal', [
            'title' => 'Product created',
            'description' => 'Your product was added successfully.',
        ]);

        return redirect()->route('products.index');
    }

    public function show(Product $product): Response
    {
        $product->load([
            'category:id,name',
            'creator:id,first_name,last_name,username',
        ]);

        return Inertia::render('Product/Show', [
            'product' => $this->productDetails($product),
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Product/Edit', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'category_id' => (string) $product->category_id,
                'brand' => $product->brand ?? '',
                'model' => $product->model ?? '',
                'description' => $product->description ?? '',
                'price' => (float) $product->price,
                'quantity' => (int) $product->quantity,
                'minimum_stock' => (float) $product->minimum_stock,
                'status' => (bool) $product->status,
            ],
            'categories' => $this->categoryOptions(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $this->validatedProduct($request);
        $validated['brand'] = $validated['brand'] ?? '';
        $validated['model'] = $validated['model'] ?? '';
        $validated['sku'] = $this->generateSku(
            $validated['category_id'],
            $validated['brand'],
            $validated['model'],
            $product,
        );

        $product->update($validated);

        Inertia::flash('successModal', [
            'title' => 'Product updated',
            'description' => 'Your product changes were saved successfully.',
        ]);

        return redirect()->route('products.show', $product);
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        Inertia::flash('successModal', [
            'title' => 'Product deleted',
            'description' => 'The product was removed successfully.',
        ]);

        return redirect()->route('products.index');
    }

    /**
     * @return array<int, array{value: string, label: string, code: string}>
     */
    private function categoryOptions(): array
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code'])
            ->map(fn (Category $category) => [
                'value' => (string) $category->id,
                'label' => $category->name,
                'code' => $category->code,
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedProduct(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'category_id' => ['required', 'exists:categories,id'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'boolean'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function productDetails(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'category_id' => $product->category_id,
            'category' => $product->category?->name ?? '',
            'brand' => $product->brand ?? '',
            'model' => $product->model ?? '',
            'description' => $product->description,
            'price' => (float) $product->price,
            'quantity' => (int) $product->quantity,
            'minimum_stock' => (float) $product->minimum_stock,
            'status' => $product->status ? 'active' : 'inactive',
            'creator' => $product->creator ? [
                'id' => $product->creator->id,
                'name' => trim($product->creator->first_name.' '.$product->creator->last_name),
                'username' => $product->creator->username,
            ] : null,
            'created_at' => $product->created_at?->toIso8601String(),
            'updated_at' => $product->updated_at?->toIso8601String(),
        ];
    }

    private function generateSku(
        int|string $categoryId,
        ?string $brand = null,
        ?string $model = null,
        ?Product $ignoreProduct = null,
    ): string {
        $categoryCode = Category::query()->whereKey($categoryId)->value('code');

        $baseSku = collect([$categoryCode, $brand, $model])
            ->filter()
            ->map(fn (string $part) => strtoupper((string) preg_replace('/[^A-Za-z0-9]/', '', $part)))
            ->filter()
            ->implode('-');

        if ($baseSku === '') {
            $baseSku = 'PRODUCT';
        }

        $sku = $baseSku;
        $suffix = 2;

        while (Product::query()
            ->where('sku', $sku)
            ->when($ignoreProduct, fn ($query) => $query->where('id', '!=', $ignoreProduct->id))
            ->exists()) {
            $sku = $baseSku.'-'.$suffix;
            $suffix++;
        }

        return $sku;
    }
}
