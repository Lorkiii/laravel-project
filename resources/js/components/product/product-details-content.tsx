import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/formatters';
import type { ProductDetails } from '@/types/product';

type ProductDetailsContentProps = {
    product: ProductDetails;
};

function DetailItem({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-foreground">{children}</dd>
        </div>
    );
}

export function ProductDetailsContent({
    product,
}: ProductDetailsContentProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="border-b border-border">
                    <CardTitle>Product information</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <dl className="grid gap-6 sm:grid-cols-2">
                        <DetailItem label="SKU">
                            <span className="font-mono">{product.sku}</span>
                        </DetailItem>
                        <DetailItem label="Category">
                            {product.category || '—'}
                        </DetailItem>
                        <DetailItem label="Brand">
                            {product.brand || '—'}
                        </DetailItem>
                        <DetailItem label="Model">
                            {product.model || '—'}
                        </DetailItem>
                        <DetailItem label="Price">
                            $
                            {product.price.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                            })}
                        </DetailItem>
                        <DetailItem label="Status">
                            <Badge
                                className={
                                    product.status === 'active'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-950'
                                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                                }
                            >
                                {product.status === 'active'
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        </DetailItem>
                        <DetailItem label="Quantity">
                            {product.quantity}
                        </DetailItem>
                        <DetailItem label="Minimum stock">
                            {product.minimum_stock}
                        </DetailItem>
                        <div className="sm:col-span-2">
                            <DetailItem label="Description">
                                <span className="whitespace-pre-wrap break-words">
                                    {product.description || '—'}
                                </span>
                            </DetailItem>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="border-b border-border">
                    <CardTitle>Record history</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <dl className="space-y-6">
                        <DetailItem label="Created by">
                            {product.creator
                                ? `${product.creator.name} (@${product.creator.username})`
                                : 'Unknown'}
                        </DetailItem>
                        <DetailItem label="Created">
                            {formatDateTime(product.created_at)}
                        </DetailItem>
                        <DetailItem label="Last updated">
                            {formatDateTime(product.updated_at)}
                        </DetailItem>
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}
