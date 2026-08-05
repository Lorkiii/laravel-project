<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
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

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/settings/account', [AccountController::class, 'edit'])->name('settings.account');
    Route::patch('/settings/account', [AccountController::class, 'update'])->name('settings.account.update');
    Route::put('/settings/account/password', [AccountController::class, 'updatePassword'])->name('settings.account.password');
});
