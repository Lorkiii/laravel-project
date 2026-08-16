import {
    ArrowLeftRight,
    ChevronRight,
    PackagePlus,
    Users,
    Warehouse,
    type LucideIcon,
} from 'lucide-react';

import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import {
    inventoryUrl,
    productCreateUrl,
    stockAdjustmentUrl,
    usersUrl,
} from '@/lib/navigation/urls';
import { cn } from '@/lib/utils';

type QuickAction = {
    title: string;
    href: string;
    pageName: string;
    permission: string;
    icon: LucideIcon;
    iconClassName: string;
};

export function AdminQuickActions() {
    const { user } = useAuth();
    const permissions = user?.permissions ?? [];
    const actions: QuickAction[] = [
        {
            title: 'Adjust Stock',
            href: stockAdjustmentUrl(),
            pageName: 'StockMovements/Adjustment',
            permission: 'inventory.adjust',
            icon: ArrowLeftRight,
            iconClassName: 'bg-amber-50 text-amber-600',
        },
        {
            title: 'Inventory',
            href: inventoryUrl(),
            pageName: 'Inventory/Index',
            permission: 'inventory.view',
            icon: Warehouse,
            iconClassName: 'bg-slate-100 text-slate-600',
        },
        {
            title: 'Add Product',
            href: productCreateUrl(),
            pageName: 'Product/Create',
            permission: 'products.create',
            icon: PackagePlus,
            iconClassName: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Users',
            href: usersUrl(),
            pageName: 'Users/Index',
            permission: 'users.view',
            icon: Users,
            iconClassName: 'bg-violet-50 text-violet-600',
        },
    ].filter((action) => permissions.includes(action.permission));

    if (actions.length === 0) {
        return null;
    }

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="border-b border-border pb-3">
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2 p-3">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <PrefetchedLink
                            key={action.title}
                            href={action.href}
                            pageName={action.pageName}
                            className="flex min-h-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                            <span
                                className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                    action.iconClassName,
                                )}
                            >
                                <Icon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1 text-sm font-medium text-slate-900">
                                {action.title}
                            </span>
                            <ChevronRight
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 text-slate-400"
                            />
                        </PrefetchedLink>
                    );
                })}
            </CardContent>
        </Card>
    );
}
