import type { LucideIcon } from 'lucide-react';
import {
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
    suppliersUrl,
    usersUrl,
} from '@/lib/navigation/urls';

export type SidebarItem = {
    id: string;
    label: string;
    icon: LucideIcon;
    href?: string;
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
                    permission: 'products.view',
                },
                {
                    id: 'categories',
                    label: 'Categories',
                    icon: FolderTree,
                    href: categoriesUrl(),
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
            permission: 'inventory.view',
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
