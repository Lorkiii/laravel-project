import {
    ArrowLeftRight,
    ChevronRight,
    Package,
} from 'lucide-react';

import { AdminQuickActions } from '@/components/dashboard/admin-quick-actions';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { AdminMovementMix, AdminTopProduct } from '@/lib/dashboard/stats';
import { productUrl, stockMovementsUrl } from '@/lib/navigation/urls';
import { cn } from '@/lib/utils';
import type { StockMovement } from '@/types/inventory';

export type AdminRecentAdjustment = Pick<
    StockMovement,
    'id' | 'product' | 'quantity' | 'reason' | 'recorded_by' | 'created_at'
>;

type AdminDashboardSectionsProps = {
    movementMix: AdminMovementMix;
    topProducts: AdminTopProduct[];
    recentAdjustments: AdminRecentAdjustment[];
};

const mixItems = [
    {
        key: 'stock_in' as const,
        label: 'Stock In',
        barClassName: 'bg-emerald-500',
        valueClassName: 'text-emerald-700',
    },
    {
        key: 'stock_out' as const,
        label: 'Stock Out',
        barClassName: 'bg-red-500',
        valueClassName: 'text-red-700',
    },
    {
        key: 'adjustment' as const,
        label: 'Adjustment',
        barClassName: 'bg-amber-500',
        valueClassName: 'text-amber-700',
    },
];

function formatAdjustmentQuantity(quantity: number): string {
    return quantity > 0 ? `+${quantity}` : String(quantity);
}

export function AdminDashboardSections({
    movementMix,
    topProducts,
    recentAdjustments,
}: AdminDashboardSectionsProps) {
    return (
        <div className="mt-6 grid items-stretch gap-4 lg:grid-cols-2">
            <MovementMixCard mix={movementMix} />
            <TopProductsCard products={topProducts} />
            <RecentAdjustmentsCard adjustments={recentAdjustments} />
            <AdminQuickActions />
        </div>
    );
}

function MovementMixCard({ mix }: { mix: AdminMovementMix }) {
    const maxQuantity = Math.max(mix.stock_in, mix.stock_out, mix.adjustment, 1);

    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="border-b border-border pb-3">
                <CardTitle>Today&apos;s Movement Mix</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-center gap-4 p-5">
                <dl className="space-y-4">
                    {mixItems.map((item) => {
                        const value = mix[item.key];

                        return (
                            <div key={item.key}>
                                <div className="mb-1.5 flex items-center justify-between gap-3">
                                    <dt className="text-sm font-medium text-slate-700">
                                        {item.label}
                                    </dt>
                                    <dd
                                        className={cn(
                                            'text-sm font-semibold tabular-nums',
                                            item.valueClassName,
                                        )}
                                    >
                                        {value}
                                    </dd>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={cn(
                                            'h-full rounded-full',
                                            item.barClassName,
                                        )}
                                        style={{
                                            width: `${(value / maxQuantity) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </dl>
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
