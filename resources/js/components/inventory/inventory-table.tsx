import { Eye, Package } from 'lucide-react';
import { useRef, useState } from 'react';

import { ViewDetailsModal } from '@/components/details/view-details-modal';
import { InventoryDetailsContent } from '@/components/inventory/inventory-details-content';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { stockStatusMeta } from '@/lib/inventory/stock-status';
import type { InventoryItem } from '@/types/inventory';

type InventoryTableProps = {
    items: InventoryItem[];
    onResetFilters: () => void;
};

export function InventoryTable({ items, onResetFilters }: InventoryTableProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(
        null,
    );
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const actionButtonRefs = useRef(new Map<number, HTMLButtonElement>());

    const viewItem = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">
                            Current stock
                        </TableHead>
                        <TableHead className="text-right">Min. stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length > 0 ? (
                        items.map((item) => {
                            const status = stockStatusMeta[item.stock_status];

                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="min-w-48 font-medium text-slate-900">
                                        {item.name}
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
                                        <Badge className={status.className}>
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            ref={(button) => {
                                                if (button) {
                                                    actionButtonRefs.current.set(
                                                        item.id,
                                                        button,
                                                    );
                                                } else {
                                                    actionButtonRefs.current.delete(
                                                        item.id,
                                                    );
                                                }
                                            }}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            aria-haspopup="dialog"
                                            onClick={() => viewItem(item)}
                                        >
                                            <Eye aria-hidden="true" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32">
                                <EmptyState
                                    title="No inventory records match your filters"
                                    description="Try clearing filters or changing your search to see products."
                                    icon={
                                        <Package
                                            aria-hidden="true"
                                            className="h-5 w-5"
                                        />
                                    }
                                    action={
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onResetFilters}
                                        >
                                            Clear filters
                                        </Button>
                                    }
                                    className="py-8"
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ViewDetailsModal
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                title={selectedItem?.name ?? 'Inventory details'}
                description="Read-only inventory details and recent stock movements for this product."
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    if (selectedItem) {
                        actionButtonRefs.current.get(selectedItem.id)?.focus();
                    }
                }}
            >
                {selectedItem ? (
                    <InventoryDetailsContent item={selectedItem} />
                ) : null}
            </ViewDetailsModal>
        </>
    );
}
