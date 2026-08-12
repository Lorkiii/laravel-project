import { PackageMinus, Warehouse } from 'lucide-react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { AppLayout } from '@/layouts/AppLayout';
import { productUrl, stockOutUrl } from '@/lib/navigation/urls';
import type { InventoryItem, StockStatus } from '@/types/inventory';

type InventoryIndexProps = {
    items: InventoryItem[];
};

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

export default function InventoryIndex({ items }: InventoryIndexProps) {
    const { user } = useAuth();
    const canStockOut =
        user?.permissions.includes('inventory.stock_out') ?? false;
    const hasAvailableProduct = items.some(
        (item) => item.is_active && item.quantity > 0,
    );

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Inventory"
                description="Review current stock levels and status across products."
                actions={
                    canStockOut ? (
                        hasAvailableProduct ? (
                            <Button asChild>
                                <PrefetchedLink
                                    href={stockOutUrl()}
                                    pageName="StockMovements/StockOut"
                                >
                                    <PackageMinus aria-hidden="true" />
                                    Record Stock Out
                                </PrefetchedLink>
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                disabled
                                title="No active products have stock available"
                            >
                                <PackageMinus aria-hidden="true" />
                                Record Stock Out
                            </Button>
                        )
                    ) : undefined
                }
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {items.length === 0 ? (
                    <EmptyState
                        title="No inventory records"
                        description="Products will appear here once they have been added."
                        icon={<Warehouse aria-hidden="true" className="h-5 w-5" />}
                        className="py-16"
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                                <TableHead className="text-right">Minimum</TableHead>
                                <TableHead>Status</TableHead>
                                {canStockOut ? (
                                    <TableHead className="text-right">Action</TableHead>
                                ) : null}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => {
                                const status = stockStatus[item.stock_status];
                                const canStockOutItem =
                                    item.is_active && item.quantity > 0;

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="min-w-48 font-medium">
                                            <PrefetchedLink
                                                href={productUrl(item.id)}
                                                pageName="Product/Show"
                                                className="text-slate-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                                            >
                                                {item.name}
                                            </PrefetchedLink>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">
                                            {item.sku}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-slate-900">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right text-slate-600">
                                            {item.minimum_stock}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge className={status.className}>
                                                    {status.label}
                                                </Badge>
                                                {!item.is_active ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-slate-200 bg-slate-50 text-slate-600"
                                                    >
                                                        Inactive
                                                    </Badge>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        {canStockOut ? (
                                            <TableCell className="text-right">
                                                {canStockOutItem ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <PrefetchedLink
                                                            href={stockOutUrl(
                                                                item.id,
                                                            )}
                                                            pageName="StockMovements/StockOut"
                                                        >
                                                            <PackageMinus
                                                                aria-hidden="true"
                                                            />
                                                            Stock Out
                                                        </PrefetchedLink>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        disabled
                                                        title={
                                                            !item.is_active
                                                                ? 'Inactive products cannot be stocked out'
                                                                : 'No stock is available'
                                                        }
                                                    >
                                                        <PackageMinus
                                                            aria-hidden="true"
                                                        />
                                                        Stock Out
                                                    </Button>
                                                )}
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

InventoryIndex.layout = (page: ReactNode) => (
    <AppLayout title="Inventory" headerTitle="Inventory">
        {page}
    </AppLayout>
);
