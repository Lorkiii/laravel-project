<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->with('creator:id,first_name,last_name,username')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'code',
                'description',
                'is_active',
                'created_by',
                'created_at',
                'updated_at',
            ])
            ->map(fn (Category $category) => $this->categoryDetails($category));

        return Inertia::render('Category/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Category/Create');
    }

    public function show(Category $category): Response
    {
        $category->load('creator:id,first_name,last_name,username');

        return Inertia::render('Category/Show', [
            'category' => $this->categoryDetails($category),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:6', 'unique:categories,code', 'alpha_num', 'uppercase'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);
        $validated['created_by'] = $request->user()->id;

        Category::create($validated);

        Inertia::flash('successModal', [
            'title' => 'Category created',
            'description' => 'Your category was added successfully.',
        ]);

        return redirect()->route('categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * @return array<string, mixed>
     */
    private function categoryDetails(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'code' => $category->code,
            'description' => $category->description,
            'status' => $category->is_active ? 'active' : 'inactive',
            'creator' => $category->creator ? [
                'id' => $category->creator->id,
                'name' => trim($category->creator->first_name.' '.$category->creator->last_name),
                'username' => $category->creator->username,
            ] : null,
            'created_at' => $category->created_at?->toIso8601String(),
            'updated_at' => $category->updated_at?->toIso8601String(),
        ];
    }
}
