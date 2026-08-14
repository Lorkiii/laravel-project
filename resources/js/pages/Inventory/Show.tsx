import { ArrowLeft, Warehouse } from 'lucide-react';
import type { ReactNode } from 'react';

import { InventoryDetailsContent } from '@/components/inventory/inventory-details-content';
import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { inventoryUrl } from '@/lib/navigation/urls';
import { AppLayout } from '@/layouts/AppLayout';
import type {
    InventoryItem,
    StockMovement,
    StockMovementType,
} from '@/types/inventory';

type InventoryShowProps = {
    item: InventoryItem;
    movements: StockMovement[];
};

const movementTypeMeta = {
    stock_in: {
        label: 'Stock In',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    },
    stock_out: {
        label: 'Stock Out',
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
    },
    adjustment: {
        label: 'Adjustment',
        className: 'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50',
    },
} satisfies Record<StockMovementType, { label: string; className: string }>;

function formatQuantity(type: StockMovementType, quantity: number): string {
    if (type === 'adjustment') {
        return quantity > 0 ? `+${quantity}` : String(quantity);
    }

    if (type === 'stock_in') {
        return `+${quantity}`;
    }

    return `-${quantity}`;
}

export default function InventoryShow({ item, movements }: InventoryShowProps) {
    return (
        <div className="mx-auto w-full max-w-5xl">
            <PageHeader
                title={item.name}
                description="Read-only inventory details for this product."
                actions={
                    <Button variant="outline" asChild>
                        <PrefetchedLink
                            href={inventoryUrl()}
                            pageName="Inventory/Index"
                        >
                            <ArrowLeft aria-hidden="true" />
                            Back to inventory
                        </PrefetchedLink>
                    </Button>
                }
            />

            <div className="space-y-4">
                <InventoryDetailsContent item={item} />

                <Card>
                    <CardHeader className="border-b border-border">
                        <CardTitle>Recent stock movements</CardTitle>
                    </CardHeader>
                    {movements.length === 0 ? (
                        <CardContent className="p-5 sm:p-6">
                            <EmptyState
                                title="No stock movements"
                                description="Recorded stock in, stock out, and adjustment transactions for this product will appear here."
                                icon={
                                    <Warehouse
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                    />
                                }
                                className="py-8"
                            />
                        </CardContent>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Date</TableHead>
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
                                    const meta =
                                        movementTypeMeta[movement.type];

                                    return (
                                        <TableRow key={movement.id}>
                                            <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                {movement.created_at}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={meta.className}
                                                >
                                                    {meta.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-slate-900">
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
        </div>
    );
}

InventoryShow.layout = (page: ReactNode) => (
    <AppLayout title="Inventory Details" headerTitle="Inventory">
        {page}
    </AppLayout>
);
