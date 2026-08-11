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
            ->with('category:id,name')
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
            ])
            ->map(function (Product $product) {
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
                ];
            });

        return Inertia::render('Product/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'code'])
            ->map(function ($category) {
                return [
                    'value' => (string) $category->id,
                    'label' => $category->name,
                    'code' => $category->code,
                ];
            });

        return Inertia::render('Product/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
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

        $validated['brand'] = $validated['brand'] ?? '';
        $validated['model'] = $validated['model'] ?? '';
        $validated['sku'] = $this->generateSku(
            $validated['category_id'],
            $validated['brand'],
            $validated['model'],
        );

        Product::create($validated);

        Inertia::flash('successModal', [
            'title' => 'Product created',
            'description' => 'Your product was added successfully.',
        ]);

        return redirect()->route('products.index');
    }

    private function generateSku(int|string $categoryId, ?string $brand = null, ?string $model = null): string
    {
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

        while (Product::query()->where('sku', $sku)->exists()) {
            $sku = $baseSku.'-'.$suffix;
            $suffix++;
        }

        return $sku;
    }
}
