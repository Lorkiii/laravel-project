import { route } from 'ziggy-js';

function namedOrPath(name: string, path: string): string {
    return route().has(name) ? route(name) : path;
}

export function loginUrl(): string {
    return route('login');
}

export function homeUrl(): string {
    return route('home');
}

export function dashboardUrl(): string {
    return namedOrPath('dashboard', '/dashboard');
}

export function forgotPasswordUrl(): string | undefined {
    return route().has('password.request') ? route('password.request') : undefined;
}

export function productsUrl(): string {
    return namedOrPath('products.index', '/products');
}

export function productCreateUrl(): string {
    return namedOrPath('products.create', '/products/create');
}

export function categoriesUrl(): string {
    return namedOrPath('categories.index', '/categories');
}

export function categoryCreateUrl(): string {
    return namedOrPath('categories.create', '/categories/create');
}

export function suppliersUrl(): string {
    return namedOrPath('suppliers.index', '/suppliers');
}

export function inventoryUrl(): string {
    return namedOrPath('inventory.index', '/inventory');
}

export function reportsUrl(): string {
    return namedOrPath('reports.index', '/reports');
}

export function usersUrl(): string {
    return namedOrPath('users.index', '/users');
}

export function settingsAccountUrl(): string {
    return namedOrPath('settings.account', '/settings/account');
}
