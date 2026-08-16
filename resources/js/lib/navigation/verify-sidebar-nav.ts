import { filterSidebarNav, type SidebarFilterItem } from './sidebar-filter';

const navTemplate: SidebarFilterItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    {
        id: 'catalog',
        label: 'Catalog',
        children: [
            {
                id: 'products',
                label: 'Products',
                href: '/products',
                permission: 'products.view',
            },
            {
                id: 'categories',
                label: 'Categories',
                href: '/categories',
                permission: 'categories.view',
            },
            {
                id: 'suppliers',
                label: 'Suppliers',
                href: '/suppliers',
                permission: 'suppliers.view',
            },
        ],
    },
    {
        id: 'inventory',
        label: 'Inventory',
        href: '/inventory',
        permission: 'inventory.view',
    },
    {
        id: 'stock-movements',
        label: 'Stock Movements',
        href: '/stock-movements',
        permission: 'inventory.view_movements',
    },
    {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        permission: 'reports.view',
    },
    {
        id: 'administration',
        label: 'Administration',
        children: [
            {
                id: 'users',
                label: 'Users',
                href: '/users',
                permission: 'users.view',
            },
            {
                id: 'audit-trail',
                label: 'Audit Trail',
                href: '/audit-trail',
                permission: 'audit.view',
            },
        ],
    },
];

const rolePermissions = {
    Administrator: [
        'products.view',
        'products.create',
        'products.edit',
        'products.delete',
        'categories.view',
        'categories.create',
        'categories.edit',
        'categories.delete',
        'suppliers.view',
        'suppliers.create',
        'suppliers.edit',
        'suppliers.delete',
        'inventory.view',
        'inventory.view_movements',
        'inventory.stock_in',
        'inventory.stock_out',
        'inventory.adjust',
        'reports.view',
        'reports.export',
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'audit.view',
        'audit.export',
    ],
    Manager: [
        'products.view',
        'products.create',
        'products.edit',
        'categories.view',
        'inventory.view',
        'inventory.view_movements',
        'inventory.stock_in',
        'inventory.stock_out',
        'inventory.adjust',
        'reports.view',
    ],
    'Warehouse Staff': [
        'products.view',
        'inventory.view',
        'inventory.view_movements',
        'inventory.stock_in',
        'inventory.stock_out',
    ],
} as const;

function summarize(items: SidebarFilterItem[]): string[] {
    return items.map((item) => {
        if (item.children?.length) {
            return `${item.id}[${item.children.map((child) => child.id).join(',')}]`;
        }

        return item.id;
    });
}

function assertEqual(actual: string[], expected: string[], label: string): void {
    const left = actual.join('|');
    const right = expected.join('|');

    if (left !== right) {
        throw new Error(`${label} failed.\nExpected: ${right}\nActual:   ${left}`);
    }
}

const expectations: Record<keyof typeof rolePermissions, string[]> = {
    Administrator: [
        'dashboard',
        'catalog[products,categories,suppliers]',
        'inventory',
        'stock-movements',
        'reports',
        'administration[users,audit-trail]',
    ],
    Manager: [
        'dashboard',
        'catalog[products,categories]',
        'inventory',
        'stock-movements',
        'reports',
    ],
    'Warehouse Staff': [
        'dashboard',
        'products',
        'inventory',
        'stock-movements',
    ],
};

for (const [role, permissions] of Object.entries(rolePermissions)) {
    const tree = filterSidebarNav(navTemplate, [...permissions]);
    assertEqual(summarize(tree), expectations[role as keyof typeof expectations], role);
    console.log(`✓ ${role}: ${summarize(tree).join(' → ')}`);
}

console.log('Sidebar permission matrix verified.');
