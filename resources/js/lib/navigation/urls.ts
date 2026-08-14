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

export function productUrl(productId: number): string {
    return route().has('products.show')
        ? route('products.show', { product: productId })
        : `/products/${productId}`;
}

export function productEditUrl(productId: number): string {
    return route().has('products.edit')
        ? route('products.edit', { product: productId })
        : `/products/${productId}/edit`;
}

export function productUpdateUrl(productId: number): string {
    return route().has('products.update')
        ? route('products.update', { product: productId })
        : `/products/${productId}`;
}

export function productDestroyUrl(productId: number): string {
    return route().has('products.destroy')
        ? route('products.destroy', { product: productId })
        : `/products/${productId}`;
}

export function categoriesUrl(): string {
    return namedOrPath('categories.index', '/categories');
}

export function categoryCreateUrl(): string {
    return namedOrPath('categories.create', '/categories/create');
}

export function categoryUrl(categoryId: number): string {
    return route().has('categories.show')
        ? route('categories.show', { category: categoryId })
        : `/categories/${categoryId}`;
}

export function suppliersUrl(): string {
    return namedOrPath('suppliers.index', '/suppliers');
}

export function inventoryUrl(): string {
    return namedOrPath('inventory.index', '/inventory');
}

export function inventoryShowUrl(productId: number): string {
    return route().has('inventory.show')
        ? route('inventory.show', { product: productId })
        : `/inventory/${productId}`;
}

export function stockMovementsUrl(type?: string): string {
    if (type && type !== 'all') {
        return route().has('stock-movements.index')
            ? route('stock-movements.index', { type })
            : `/stock-movements?type=${encodeURIComponent(type)}`;
    }

    return namedOrPath('stock-movements.index', '/stock-movements');
}

export function stockInUrl(productId?: number): string {
    if (productId) {
        return route().has('stock-movements.stock-in.create')
            ? route('stock-movements.stock-in.create', { product_id: productId })
            : `/stock-movements/stock-in?product_id=${productId}`;
    }

    return namedOrPath(
        'stock-movements.stock-in.create',
        '/stock-movements/stock-in',
    );
}

export function stockInStoreUrl(): string {
    return namedOrPath(
        'stock-movements.stock-in.store',
        '/stock-movements/stock-in',
    );
}

export function stockOutUrl(productId?: number): string {
    if (productId) {
        return route().has('stock-movements.stock-out.create')
            ? route('stock-movements.stock-out.create', { product_id: productId })
            : `/stock-movements/stock-out?product_id=${productId}`;
    }

    return namedOrPath(
        'stock-movements.stock-out.create',
        '/stock-movements/stock-out',
    );
}

export function stockOutStoreUrl(): string {
    return namedOrPath(
        'stock-movements.stock-out.store',
        '/stock-movements/stock-out',
    );
}

export function stockAdjustmentUrl(productId?: number): string {
    if (productId) {
        return route().has('stock-movements.adjustment.create')
            ? route('stock-movements.adjustment.create', {
                  product_id: productId,
              })
            : `/stock-movements/adjustment?product_id=${productId}`;
    }

    return namedOrPath(
        'stock-movements.adjustment.create',
        '/stock-movements/adjustment',
    );
}

export function stockAdjustmentStoreUrl(): string {
    return namedOrPath(
        'stock-movements.adjustment.store',
        '/stock-movements/adjustment',
    );
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
