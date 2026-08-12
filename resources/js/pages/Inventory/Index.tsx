import { usePage } from '@inertiajs/react';
import { ClipboardList, PackageMinus, Warehouse } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';

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
import { AppLayout } from '@/layouts/AppLayout';
import { productUrl } from '@/lib/navigation/urls';
import type {
    InventoryItem,
    StockMovement,
    StockOutReason,
    StockStatus,
} from '@/types/inventory';
import { StockOutDialog } from './StockOutDialog';

type InventoryIndexProps = {
    items: InventoryItem[];
    movements: StockMovement[];
    stockOutReasons: StockOutReason[];
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

export default function InventoryIndex({
    items,
    movements,
    stockOutReasons,
}: InventoryIndexProps) {
    const { auth } = usePage().props;
    const canStockOut =
        auth.user?.permissions.includes('inventory.stock_out') ?? false;
    const hasAvailableProduct = items.some(
        (item) => item.is_active && item.quantity > 0,
    );
    const [stockOutOpen, setStockOutOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null,
    );

    const openStockOut = (productId: number | null = null) => {
        setSelectedProductId(productId);
        setStockOutOpen(true);
    };

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Inventory"
                description="Review current stock levels, status, and stock-out activity."
                actions={
                    canStockOut ? (
                        <Button
                            type="button"
                            onClick={() => openStockOut()}
                            disabled={!hasAvailableProduct}
                            title={
                                hasAvailableProduct
                                    ? undefined
                                    : 'No active products have stock available'
                            }
                        >
                            <PackageMinus aria-hidden="true" />
                            Record Stock Out
                        </Button>
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
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openStockOut(item.id)
                                                    }
                                                    disabled={
                                                        !item.is_active ||
                                                        item.quantity === 0
                                                    }
                                                    title={
                                                        !item.is_active
                                                            ? 'Inactive products cannot be stocked out'
                                                            : item.quantity === 0
                                                              ? 'No stock is available'
                                                              : undefined
                                                    }
                                                >
                                                    <PackageMinus
                                                        aria-hidden="true"
                                                    />
                                                    Stock Out
                                                </Button>
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>

            <section className="mt-8">
                <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Stock Out Movements
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Recent stock removed from inventory.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {movements.length === 0 ? (
                        <EmptyState
                            title="No stock-out movements"
                            description="Completed stock-out transactions will appear here."
                            icon={
                                <ClipboardList
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />
                            }
                            className="py-14"
                        />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">
                                        Quantity
                                    </TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Recipient / Reference</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Recorded By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.created_at}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-slate-900">
                                                {movement.product.name}
                                            </div>
                                            <div className="font-mono text-xs text-slate-500">
                                                {movement.product.sku}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-slate-900">
                                            {movement.quantity}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="whitespace-nowrap border-slate-200 bg-slate-50 text-slate-700"
                                            >
                                                {movement.reason}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-56 text-sm text-slate-600">
                                            {movement.reference || '—'}
                                        </TableCell>
                                        <TableCell className="max-w-64 text-sm text-slate-600">
                                            {movement.notes || '—'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.recorded_by}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </section>

            {canStockOut && stockOutOpen ? (
                <StockOutDialog
                    open={stockOutOpen}
                    onOpenChange={(open) => {
                        setStockOutOpen(open);

                        if (!open) {
                            setSelectedProductId(null);
                        }
                    }}
                    items={items}
                    reasons={stockOutReasons}
                    initialProductId={selectedProductId}
                />
            ) : null}
        </div>
    );
}

InventoryIndex.layout = (page: ReactNode) => (
    <AppLayout title="Inventory" headerTitle="Inventory">
        {page}
    </AppLayout>
);
