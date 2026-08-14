import { DetailField } from '@/components/details/details-fields';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { stockStatusMeta } from '@/lib/inventory/stock-status';
import type { InventoryItem } from '@/types/inventory';

type InventoryDetailsContentProps = {
    item: InventoryItem;
};

export function InventoryDetailsContent({ item }: InventoryDetailsContentProps) {
    const status = stockStatusMeta[item.stock_status];

    return (
        <Card>
            <CardHeader className="border-b border-border">
                <CardTitle>Inventory details</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
                <dl className="grid gap-6 sm:grid-cols-2">
                    <DetailField label="Product name">{item.name}</DetailField>
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
    );
}
