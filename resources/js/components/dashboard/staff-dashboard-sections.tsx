import { ArrowLeftRight, ChevronRight, PackageMinus, PackagePlus, TriangleAlert } from 'lucide-react';

import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { StaffQuickActions } from '@/components/dashboard/staff-quick-actions';
import { StockMovementTrendChart } from '@/components/dashboard/stock-movement-trend-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import type { StaffStockOverview } from '@/lib/dashboard/stats';
import { inventoryUrl, productUrl, stockInUrl, stockMovementsUrl } from '@/lib/navigation/urls';
import { cn } from '@/lib/utils';
import type {
    InventoryItem,
    StockMovement,
    StockMovementType,
    StockStatus,
} from '@/types/inventory';

export type StaffRecentMovement = Pick<
    StockMovement,
    'id' | 'product' | 'type' | 'quantity' | 'reason' | 'recorded_by' | 'created_at'
>;

type StaffDashboardSectionsProps = {
    stockOverview: StaffStockOverview;
    attentionItems: InventoryItem[];
    recentMovements: StaffRecentMovement[];
};

const typeMeta = {
    stock_in: {
        label: 'Stock In',
        icon: PackagePlus,
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
        quantityClassName: 'text-emerald-700',
    },
    stock_out: {
        label: 'Stock Out',
        icon: PackageMinus,
        className:
            'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
        quantityClassName: 'text-red-700',
    },
    adjustment: {
        label: 'Adjustment',
        icon: ArrowLeftRight,
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
        quantityClassName: 'text-slate-700',
    },
} satisfies Record<
    StockMovementType,
    {
        label: string;
        icon: typeof PackagePlus;
        className: string;
        quantityClassName: string;
    }
>;

const stockStatus = {
    in_stock: {
        label: 'In Stock',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    },
    low_stock: {
        label: 'Low Stock',
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
    },
    out_of_stock: {
        label: 'Out of Stock',
        className: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
    },
} satisfies Record<StockStatus, { label: string; className: string }>;

function formatQuantity(type: StockMovementType, quantity: number): string {
    if (type === 'stock_in') {
        return `+${quantity}`;
    }

    if (type === 'adjustment') {
        return quantity > 0 ? `+${quantity}` : String(quantity);
    }

    return `-${quantity}`;
}

export function StaffDashboardSections({
    stockOverview,
    attentionItems,
    recentMovements,
}: StaffDashboardSectionsProps) {
    return (
        <div className="mt-6 space-y-4">
            <div className="grid items-stretch gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b border-border pb-3">
                        <CardTitle>Stock Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5">
                        <dl className="grid grid-cols-3 gap-4">
                            <OverviewItem
                                label="Total Quantity"
                                value={stockOverview.total_quantity}
                            />
                            <OverviewItem
                                label="In Stock"
                                value={stockOverview.in_stock_count}
                                valueClassName="text-emerald-700"
                            />
                            <OverviewItem
                                label="Out of Stock"
                                value={stockOverview.out_of_stock_count}
                                valueClassName="text-red-700"
                            />
                        </dl>

                        <div className="mt-5 border-t border-border pt-4">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Stock Movement Trend
                                </h2>
                                {stockOverview.trend.length > 0 ? (
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                            Stock In
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-red-500" />
                                            Stock Out
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                            {stockOverview.trend.length === 0 ? (
                                <EmptyState
                                    title="No stock movement history"
                                    description="Record stock in or stock out to compare activity over the last 7 days."
                                    icon={
                                        <ArrowLeftRight
                                            aria-hidden="true"
                                            className="h-5 w-5"
                                        />
                                    }
                                    className="py-8"
                                />
                            ) : (
                                <StockMovementTrendChart points={stockOverview.trend} />
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex h-full flex-col gap-4">
                    <StaffQuickActions />
                    <NeedsAttentionCard items={attentionItems} />
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-3">
                    <CardTitle>Recent Stock Movements</CardTitle>
                    <PrefetchedLink
                        href={stockMovementsUrl()}
                        pageName="StockMovements/Index"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                    >
                        View all movements
                        <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </PrefetchedLink>
                </CardHeader>
                {recentMovements.length === 0 ? (
                    <EmptyState
                        title="No recent stock movements"
                        description="Your stock in and stock out activity will appear here."
                        icon={
                            <ArrowLeftRight
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                        }
                        className="py-8"
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Date</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">
                                    Quantity
                                </TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>User</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentMovements.map((movement) => {
                                const meta = typeMeta[movement.type];
                                const TypeIcon = meta.icon;

                                return (
                                    <TableRow key={movement.id}>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.created_at}
                                        </TableCell>
                                        <TableCell className="min-w-48 font-medium text-slate-900">
                                            {movement.product.name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">
                                            {movement.product.sku}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={meta.className}>
                                                <TypeIcon aria-hidden="true" />
                                                {meta.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell
                                            className={cn(
                                                'text-right font-medium',
                                                meta.quantityClassName,
                                            )}
                                        >
                                            {formatQuantity(
                                                movement.type,
                                                movement.quantity,
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-56 text-sm text-slate-600">
                                            {movement.reason || '—'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.recorded_by}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}

function NeedsAttentionCard({ items }: { items: InventoryItem[] }) {
    const { user } = useAuth();
    const canStockIn = user?.permissions.includes('inventory.stock_in') ?? false;

    return (
        <Card className="flex min-h-0 flex-1 flex-col">
            <CardHeader className="border-b border-border pb-3">
                <CardTitle>Needs Attention</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3">
                {items.length === 0 ? (
                    <EmptyState
                        title="All products are adequately stocked"
                        description="Low stock and out of stock products will appear here."
                        icon={
                            <TriangleAlert
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                        }
                        className="py-6"
                    />
                ) : (
                    <ul className="space-y-2">
                        {items.map((item) => {
                            const status = stockStatus[item.stock_status];
                            const href = canStockIn
                                ? stockInUrl(item.id)
                                : productUrl(item.id);
                            const pageName = canStockIn
                                ? 'StockMovements/StockIn'
                                : 'Product/Show';

                            return (
                                <li key={item.id}>
                                    <PrefetchedLink
                                        href={href}
                                        pageName={pageName}
                                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-slate-900">
                                                {item.name}
                                            </span>
                                            <span className="block font-mono text-xs text-slate-500">
                                                {item.sku}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-right">
                                            <span className="block text-sm font-medium text-slate-900">
                                                {item.quantity} / {item.minimum_stock}
                                            </span>
                                            <Badge className={cn('mt-1', status.className)}>
                                                {status.label}
                                            </Badge>
                                        </span>
                                    </PrefetchedLink>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardContent>
            <CardFooter className="border-t border-border p-3">
                <PrefetchedLink
                    href={inventoryUrl()}
                    pageName="Inventory/Index"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                    View inventory
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </PrefetchedLink>
            </CardFooter>
        </Card>
    );
}

function OverviewItem({
    label,
    value,
    valueClassName = 'text-slate-900',
}: {
    label: string;
    value: number;
    valueClassName?: string;
}) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd
                className={cn(
                    'mt-1 text-xl font-semibold tracking-tight',
                    valueClassName,
                )}
            >
                {value}
            </dd>
        </div>
    );
}
