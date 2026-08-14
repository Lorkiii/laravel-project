import type { LucideIcon } from 'lucide-react';
import {
    ArrowLeftRight,
    Boxes,
    ClipboardList,
    FolderTree,
    LayoutDashboard,
    Package,
    Shield,
    Truck,
    Users,
    Warehouse,
} from 'lucide-react';

import {
    filterSidebarNav as filterSidebarNavBase,
    groupContainsActivePath,
    isSidebarPathActive,
} from '@/lib/navigation/sidebar-filter';
import {
    categoriesUrl,
    dashboardUrl,
    inventoryUrl,
    productsUrl,
    reportsUrl,
    stockMovementsUrl,
    suppliersUrl,
    usersUrl,
} from '@/lib/navigation/urls';

export type SidebarItem = {
    id: string;
    label: string;
    icon: LucideIcon;
    href?: string;
    pageName?: string;
    permission?: string;
    children?: SidebarItem[];
};

export function getSidebarNav(): SidebarItem[] {
    return [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: dashboardUrl(),
            pageName: 'Dashboard/Dashboard',
        },
        {
            id: 'catalog',
            label: 'Catalog',
            icon: Package,
            children: [
                {
                    id: 'products',
                    label: 'Products',
                    icon: Boxes,
                    href: productsUrl(),
                    pageName: 'Product/Index',
                    permission: 'products.view',
                },
                {
                    id: 'categories',
                    label: 'Categories',
                    icon: FolderTree,
                    href: categoriesUrl(),
                    pageName: 'Category/Index',
                    permission: 'categories.view',
                },
                {
                    id: 'suppliers',
                    label: 'Suppliers',
                    icon: Truck,
                    href: suppliersUrl(),
                    permission: 'suppliers.view',
                },
            ],
        },
        {
            id: 'inventory',
            label: 'Inventory',
            icon: Warehouse,
            href: inventoryUrl(),
            pageName: 'Inventory/Index',
            permission: 'inventory.view',
        },
        {
            id: 'stock-movements',
            label: 'Stock Movements',
            icon: ArrowLeftRight,
            href: stockMovementsUrl(),
            pageName: 'StockMovements/Index',
            permission: 'inventory.view_movements',
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: ClipboardList,
            href: reportsUrl(),
            permission: 'reports.view',
        },
        {
            id: 'administration',
            label: 'Administration',
            icon: Shield,
            children: [
                {
                    id: 'users',
                    label: 'Users',
                    icon: Users,
                    href: usersUrl(),
                    pageName: 'Users/Index',
                    permission: 'users.view',
                },
            ],
        },
    ];
}

export function filterSidebarNav(
    items: SidebarItem[],
    permissions: string[],
): SidebarItem[] {
    return filterSidebarNavBase(items, permissions);
}

export { groupContainsActivePath, isSidebarPathActive };
