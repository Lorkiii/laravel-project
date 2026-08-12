<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Inventory\InventoryController;
use App\Http\Controllers\Inventory\StockMovementController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Settings\AccountController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/products', [ProductController::class, 'index'])
        ->middleware('permission:products.view')
        ->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])
        ->middleware('permission:products.create')
        ->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])
        ->middleware('permission:products.create')
        ->name('products.store');
    Route::get('/products/{product}', [ProductController::class, 'show'])
        ->middleware('permission:products.view')
        ->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->middleware('permission:products.edit')
        ->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->middleware('permission:products.edit')
        ->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->middleware('permission:products.delete')
        ->name('products.destroy');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/categories', [CategoryController::class, 'index'])
        ->middleware('permission:categories.view')
        ->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])
        ->middleware('permission:categories.create')
        ->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('permission:categories.create')
        ->name('categories.store');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])
        ->middleware('permission:categories.view')
        ->name('categories.show');

    Route::get('/inventory', [InventoryController::class, 'index'])
        ->middleware('permission:inventory.view')
        ->name('inventory.index');

    Route::get('/stock-movements', [StockMovementController::class, 'index'])
        ->middleware('permission:inventory.view_movements')
        ->name('stock-movements.index');
    Route::get('/stock-movements/stock-in', [StockMovementController::class, 'createStockIn'])
        ->middleware('permission:inventory.stock_in')
        ->name('stock-movements.stock-in.create');
    Route::post('/stock-movements/stock-in', [StockMovementController::class, 'storeStockIn'])
        ->middleware('permission:inventory.stock_in')
        ->name('stock-movements.stock-in.store');
    Route::get('/stock-movements/stock-out', [StockMovementController::class, 'createStockOut'])
        ->middleware('permission:inventory.stock_out')
        ->name('stock-movements.stock-out.create');
    Route::post('/stock-movements/stock-out', [StockMovementController::class, 'storeStockOut'])
        ->middleware('permission:inventory.stock_out')
        ->name('stock-movements.stock-out.store');
    Route::get('/stock-movements/adjustment', [StockMovementController::class, 'createAdjustment'])
        ->middleware('permission:inventory.adjust')
        ->name('stock-movements.adjustment.create');
    Route::post('/stock-movements/adjustment', [StockMovementController::class, 'storeAdjustment'])
        ->middleware('permission:inventory.adjust')
        ->name('stock-movements.adjustment.store');

    Route::get('/settings/account', [AccountController::class, 'edit'])->name('settings.account');
    Route::patch('/settings/account', [AccountController::class, 'update'])->name('settings.account.update');
    Route::put('/settings/account/password', [AccountController::class, 'updatePassword'])->name('settings.account.password');
});
