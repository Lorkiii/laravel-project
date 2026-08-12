import { useForm } from '@inertiajs/react';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/layouts/AppLayout';
import {
    stockInStoreUrl,
    stockMovementsUrl,
} from '@/lib/navigation/urls';
import type {
    StockInReason,
    StockMovementProductOption,
} from '@/types/inventory';

type StockInForm = {
    product_id: string;
    quantity: string;
    reason: '' | StockInReason;
    reference: string;
    notes: string;
};

type StockInProps = {
    products: StockMovementProductOption[];
    reasons: StockInReason[];
    selectedProductId: number | null;
};

export default function StockIn({
    products,
    reasons,
    selectedProductId,
}: StockInProps) {
    const { data, setData, post, processing, errors, clearErrors } =
        useForm<StockInForm>({
            product_id: selectedProductId ? String(selectedProductId) : '',
            quantity: '',
            reason: '',
            reference: '',
            notes: '',
        });

    const selectedProduct =
        products.find((product) => String(product.id) === data.product_id) ??
        null;
    const quantity = Number(data.quantity);
    const hasValidQuantity = Number.isInteger(quantity) && quantity >= 1;
    const canSubmit =
        selectedProduct?.selectable === true &&
        hasValidQuantity &&
        data.reason !== '';

    return (
        <div className="mx-auto w-full max-w-3xl">
            <PageHeader
                title="Stock In"
                description="Increase inventory by recording received stock."
                actions={
                    <Button variant="outline" asChild>
                        <PrefetchedLink
                            href={stockMovementsUrl()}
                            pageName="StockMovements/Index"
                        >
                            <ArrowLeft aria-hidden="true" />
                            Back to movements
                        </PrefetchedLink>
                    </Button>
                }
            />

            <Card>
                <CardHeader className="border-b border-slate-100">
                    <CardTitle>Stock in details</CardTitle>
                    <CardDescription>
                        Enter the quantity received. The final stock level is
                        calculated on the server.
                    </CardDescription>
                </CardHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!canSubmit) {
                            return;
                        }

                        post(stockInStoreUrl());
                    }}
                >
                    <CardContent className="space-y-5 pt-6">
                        <Field
                            htmlFor="stock-in-product"
                            label="Product"
                            required
                            error={errors.product_id}
                        >
                            <Select
                                id="stock-in-product"
                                value={data.product_id}
                                onChange={(event) => {
                                    setData('product_id', event.target.value);
                                    clearErrors('product_id');
                                }}
                                required
                            >
                                <option value="">Select a product</option>
                                {products.map((product) => (
                                    <option
                                        key={product.id}
                                        value={product.id}
                                        disabled={!product.selectable}
                                    >
                                        {product.name} ({product.sku})
                                        {!product.is_active
                                            ? ' — Inactive'
                                            : ''}
                                    </option>
                                ))}
                            </Select>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                htmlFor="stock-in-current"
                                label="Current Stock"
                            >
                                <Input
                                    id="stock-in-current"
                                    value={selectedProduct?.quantity ?? ''}
                                    placeholder="Select a product"
                                    readOnly
                                    disabled
                                />
                            </Field>
                            <Field
                                htmlFor="stock-in-quantity"
                                label="Quantity Received"
                                required
                                error={errors.quantity}
                            >
                                <Input
                                    id="stock-in-quantity"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={data.quantity}
                                    onChange={(event) => {
                                        setData('quantity', event.target.value);
                                        clearErrors('quantity');
                                    }}
                                    disabled={!selectedProduct}
                                    placeholder="0"
                                    required
                                />
                            </Field>
                        </div>

                        <Field
                            htmlFor="stock-in-reason"
                            label="Reason"
                            required
                            error={errors.reason}
                        >
                            <Select
                                id="stock-in-reason"
                                value={data.reason}
                                onChange={(event) => {
                                    setData(
                                        'reason',
                                        event.target
                                            .value as StockInForm['reason'],
                                    );
                                    clearErrors('reason');
                                }}
                                required
                            >
                                <option value="">Select a reason</option>
                                {reasons.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </Select>
                        </Field>

                        <Field
                            htmlFor="stock-in-reference"
                            label="Reference"
                            hint="Optional"
                            error={errors.reference}
                        >
                            <Input
                                id="stock-in-reference"
                                value={data.reference}
                                onChange={(event) => {
                                    setData('reference', event.target.value);
                                    clearErrors('reference');
                                }}
                                placeholder="PO number, delivery note, or transfer reference"
                                maxLength={255}
                            />
                        </Field>

                        <Field
                            htmlFor="stock-in-notes"
                            label="Notes"
                            hint="Optional"
                            error={errors.notes}
                        >
                            <Textarea
                                id="stock-in-notes"
                                value={data.notes}
                                onChange={(event) =>
                                    setData('notes', event.target.value)
                                }
                                placeholder="Add any relevant details..."
                                maxLength={1000}
                            />
                        </Field>
                    </CardContent>

                    <CardFooter className="justify-end gap-2 border-t border-slate-100 bg-slate-50/50 p-6">
                        <Button variant="outline" asChild disabled={processing}>
                            <PrefetchedLink
                                href={stockMovementsUrl()}
                                pageName="StockMovements/Index"
                            >
                                Cancel
                            </PrefetchedLink>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !canSubmit}
                        >
                            <PackagePlus aria-hidden="true" />
                            {processing ? 'Recording...' : 'Record Stock In'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

StockIn.layout = (page: ReactNode) => (
    <AppLayout title="Stock In" headerTitle="Stock Movements">
        {page}
    </AppLayout>
);
