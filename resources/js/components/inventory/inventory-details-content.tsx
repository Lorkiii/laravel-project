import { Warehouse } from 'lucide-react';

import { DetailField } from '@/components/details/details-fields';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { stockStatusMeta } from '@/lib/inventory/stock-status';
import type {
    InventoryItem,
    StockMovement,
    StockMovementType,
} from '@/types/inventory';

type InventoryDetailsContentProps = {
    item: InventoryItem;
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

export function InventoryDetailsContent({ item }: InventoryDetailsContentProps) {
    const status = stockStatusMeta[item.stock_status];
    const movements = item.movements ?? [];

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="border-b border-border">
                    <CardTitle>Inventory details</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <dl className="grid gap-6 sm:grid-cols-2">
                        <DetailField label="Product name">
                            {item.name}
                        </DetailField>
                        <DetailField label="SKU">
                            <span className="font-mono">{item.sku}</span>
                        </DetailField>
                        <DetailField label="Category">
                            {item.category || '—'}
                        </DetailField>
                        <DetailField label="Current stock">
                            {item.quantity}
                        </DetailField>
                        <DetailField label="Minimum stock">
                            {item.minimum_stock}
                        </DetailField>
                        <DetailField label="Current stock status">
                            <Badge className={status.className}>
                                {status.label}
                            </Badge>
                        </DetailField>
                    </dl>
                </CardContent>
            </Card>

            <StockMovementsCard movements={movements} />
        </div>
    );
}

function StockMovementsCard({ movements }: { movements: StockMovement[] }) {
    return (
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
                <div className="max-h-80 overflow-y-auto overscroll-contain">
                    <table className="w-full caption-bottom text-sm">
                        <TableHeader className="sticky top-0 z-10 bg-card">
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
                                const meta = movementTypeMeta[movement.type];

                                return (
                                    <TableRow key={movement.id}>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.created_at}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={meta.className}>
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
                    </table>
                </div>
            )}
        </Card>
    );
}
