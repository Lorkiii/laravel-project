import { useState } from 'react';
import {
    ArrowLeftRight,
    ChevronRight,
    Package,
    PackageMinus,
    PackagePlus,
} from 'lucide-react';

import { AdminQuickActions } from '@/components/dashboard/admin-quick-actions';
import {
    formatMixValue,
    MixSeriesSwatch,
    mixSeries,
    MovementMixChart,
    MovementMixMetricToggle,
} from '@/components/dashboard/movement-mix-chart';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type {
    AdminMovementMix,
    AdminTopProduct,
    MovementMixMetric,
} from '@/lib/dashboard/stats';
import { productUrl, stockMovementsUrl } from '@/lib/navigation/urls';
import { cn } from '@/lib/utils';
import type { StockMovement, StockMovementType } from '@/types/inventory';

export type AdminRecentAdjustment = Pick<
    StockMovement,
    'id' | 'product' | 'quantity' | 'reason' | 'recorded_by' | 'created_at'
>;

export type AdminRecentMovement = Pick<
    StockMovement,
    'id' | 'product' | 'type' | 'quantity' | 'reason' | 'recorded_by' | 'created_at'
>;

type AdminDashboardSectionsProps = {
    movementMix: AdminMovementMix;
    topProducts: AdminTopProduct[];
    recentAdjustments: AdminRecentAdjustment[];
    recentMovements: AdminRecentMovement[];
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

function formatAdjustmentQuantity(quantity: number): string {
    return quantity > 0 ? `+${quantity}` : String(quantity);
}

function formatQuantity(type: StockMovementType, quantity: number): string {
    if (type === 'stock_in') {
        return `+${quantity}`;
    }

    if (type === 'adjustment') {
        return quantity > 0 ? `+${quantity}` : String(quantity);
    }

    return `-${quantity}`;
}

export function AdminDashboardSections({
    movementMix,
    topProducts,
    recentAdjustments,
    recentMovements,
}: AdminDashboardSectionsProps) {
    return (
        <div className="mt-6 space-y-4">
            <MovementMixCard mix={movementMix} />
            <div className="grid items-stretch gap-4 lg:grid-cols-3">
                <TopProductsCard products={topProducts} />
                <RecentAdjustmentsCard adjustments={recentAdjustments} />
                <AdminQuickActions />
            </div>
            <RecentStockMovementsCard movements={recentMovements} />
        </div>
    );
}

function MovementMixCard({ mix }: { mix: AdminMovementMix }) {
    const [metric, setMetric] = useState<MovementMixMetric>('quantity');
    const hasActivity =
        mix.totals.stock_in.count +
            mix.totals.stock_out.count +
            mix.totals.adjustment.count >
        0;
    const metricHint =
        metric === 'quantity' ? 'Units moved by hour' : 'Movements recorded by hour';

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 space-y-0 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <CardTitle>Today&apos;s Movement Mix</CardTitle>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                        {metricHint}
                    </p>
                </div>
                <MovementMixMetricToggle value={metric} onChange={setMetric} />
            </CardHeader>
            <CardContent className="p-5">
                {hasActivity ? (
                    <>
                        <ul className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                            {mixSeries.map((series) => (
                                <li
                                    key={series.key}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <MixSeriesSwatch
                                        color={series.color}
                                        dashArray={series.dashArray}
                                    />
                                    <span className="text-slate-600">
                                        {series.label}
                                    </span>
                                    <span
                                        className={cn(
                                            'font-semibold tabular-nums',
                                            series.textClassName,
                                        )}
                                    >
                                        {formatMixValue(
                                            series.key,
                                            mix.totals[series.key][metric],
                                            metric,
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <MovementMixChart points={mix.points} metric={metric} />
                    </>
                ) : (
                    <EmptyState
                        title="No stock movements recorded today"
                        description="Stock in, stock out, and adjustments will appear here by hour."
                        icon={
                            <ArrowLeftRight
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                        }
                        className="py-8"
                    />
                )}
            </CardContent>
        </Card>
    );
}

function TopProductsCard({ products }: { products: AdminTopProduct[] }) {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-3">
                <CardTitle>Top Products</CardTitle>
                <span className="text-xs font-medium text-slate-500">
                    Last 7 days
                </span>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-3">
                {products.length === 0 ? (
                    <EmptyState
                        title="No stock activity in the last 7 days"
                        description="Products with the most movements will appear here."
                        icon={
                            <Package aria-hidden="true" className="h-5 w-5" />
                        }
                        className="py-6"
                    />
                ) : (
                    <ul className="space-y-2">
                        {products.map((product) => (
                            <li key={product.id}>
                                <PrefetchedLink
                                    href={productUrl(product.id)}
                                    pageName="Product/Show"
                                    className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium text-slate-900">
                                            {product.name}
                                        </span>
                                        <span className="block font-mono text-xs text-slate-500">
                                            {product.sku}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900">
                                        {product.movement_count}
                                        <span className="mt-0.5 block text-xs font-medium text-slate-500">
                                            {product.movement_count === 1
                                                ? 'movement'
                                                : 'movements'}
                                        </span>
                                    </span>
                                </PrefetchedLink>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

function RecentAdjustmentsCard({
    adjustments,
}: {
    adjustments: AdminRecentAdjustment[];
}) {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-3">
                <CardTitle>Recent Adjustments</CardTitle>
                <PrefetchedLink
                    href={stockMovementsUrl('adjustment')}
                    pageName="StockMovements/Index"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                >
                    View all
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </PrefetchedLink>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-3">
                {adjustments.length === 0 ? (
                    <EmptyState
                        title="No recent stock adjustments"
                        description="Team adjustments will appear here."
                        icon={
                            <ArrowLeftRight
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                        }
                        className="py-6"
                    />
                ) : (
                    <ul className="space-y-2">
                        {adjustments.map((adjustment) => (
                            <li
                                key={adjustment.id}
                                className="rounded-xl border border-slate-200 px-3 py-2.5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium text-slate-900">
                                            {adjustment.product.name}
                                        </span>
                                        <span className="block font-mono text-xs text-slate-500">
                                            {adjustment.product.sku}
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-right text-sm font-semibold tabular-nums text-slate-900">
                                        {formatAdjustmentQuantity(
                                            adjustment.quantity,
                                        )}
                                    </span>
                                </div>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                    <span>{adjustment.created_at}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{adjustment.recorded_by}</span>
                                    {adjustment.reason ? (
                                        <>
                                            <span aria-hidden="true">·</span>
                                            <span>{adjustment.reason}</span>
                                        </>
                                    ) : null}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

function RecentStockMovementsCard({
    movements,
}: {
    movements: AdminRecentMovement[];
}) {
    return (
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
            {movements.length === 0 ? (
                <EmptyState
                    title="No recent stock movements"
                    description="Stock in, stock out, and adjustment activity will appear here."
                    icon={
                        <ArrowLeftRight
                            aria-hidden="true"
                            className="h-5 w-5"
                        />
                    }
                    className="py-8"
                />
            ) : (
                <div className="overflow-x-auto">
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
                            {movements.map((movement) => {
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
                </div>
            )}
        </Card>
    );
}
