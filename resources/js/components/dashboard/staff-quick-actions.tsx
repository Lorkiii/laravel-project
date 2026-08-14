import {
    ArrowLeftRight,
    PackageMinus,
    PackagePlus,
    Warehouse,
    type LucideIcon,
} from 'lucide-react';

import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import {
    inventoryUrl,
    stockInUrl,
    stockMovementsUrl,
    stockOutUrl,
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

export function StaffQuickActions() {
    const { user } = useAuth();
    const permissions = user?.permissions ?? [];
    const actions: QuickAction[] = [
        {
            title: 'Stock In',
            href: stockInUrl(),
            pageName: 'StockMovements/StockIn',
            permission: 'inventory.stock_in',
            icon: PackagePlus,
            iconClassName: 'bg-emerald-50 text-emerald-600',
        },
        {
            title: 'Stock Out',
            href: stockOutUrl(),
            pageName: 'StockMovements/StockOut',
            permission: 'inventory.stock_out',
            icon: PackageMinus,
            iconClassName: 'bg-red-50 text-red-600',
        },
        {
            title: 'Movements',
            href: stockMovementsUrl(),
            pageName: 'StockMovements/Index',
            permission: 'inventory.view_movements',
            icon: ArrowLeftRight,
            iconClassName: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Inventory',
            href: inventoryUrl(),
            pageName: 'Inventory/Index',
            permission: 'inventory.view',
            icon: Warehouse,
            iconClassName: 'bg-amber-50 text-amber-600',
        },
    ].filter((action) => permissions.includes(action.permission));

    if (actions.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader className="border-b border-border pb-3">
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 p-3">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <PrefetchedLink
                            key={action.title}
                            href={action.href}
                            pageName={action.pageName}
                            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-2 py-3 text-center transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                            <span
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-lg',
                                    action.iconClassName,
                                )}
                            >
                                <Icon aria-hidden="true" className="h-4 w-4" />
                            </span>
                            <span className="text-xs font-medium text-slate-900">
                                {action.title}
                            </span>
                        </PrefetchedLink>
                    );
                })}
            </CardContent>
        </Card>
    );
}
