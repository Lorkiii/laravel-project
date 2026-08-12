import { useForm } from '@inertiajs/react';
import { ArrowLeft, PackageMinus } from 'lucide-react';
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
    stockMovementsUrl,
    stockOutStoreUrl,
} from '@/lib/navigation/urls';
import type {
    StockMovementProductOption,
    StockOutReason,
} from '@/types/inventory';

type StockOutForm = {
    product_id: string;
    quantity: string;
    reason: '' | StockOutReason;
    reference: string;
    notes: string;
};

type StockOutProps = {
    products: StockMovementProductOption[];
    reasons: StockOutReason[];
    selectedProductId: number | null;
};

export default function StockOut({
    products,
    reasons,
    selectedProductId,
}: StockOutProps) {
    const { data, setData, post, processing, errors, clearErrors } =
        useForm<StockOutForm>({
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
    const hasValidQuantity =
        selectedProduct !== null &&
        Number.isInteger(quantity) &&
        quantity >= 1 &&
        quantity <= selectedProduct.quantity;
    const requiresReference = data.reason === 'Internal Request';
    const canSubmit =
        selectedProduct?.selectable === true &&
        hasValidQuantity &&
        data.reason !== '' &&
        (!requiresReference || data.reference.trim() !== '');

    return (
        <div className="mx-auto w-full max-w-3xl">
            <PageHeader
                title="Stock Out"
                description="Decrease inventory by recording released stock."
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
                    <CardTitle>Stock out details</CardTitle>
                    <CardDescription>
                        Remove available inventory and create an auditable stock
                        movement.
                    </CardDescription>
                </CardHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!canSubmit) {
                            return;
                        }

                        post(stockOutStoreUrl());
                    }}
                >
                    <CardContent className="space-y-5 pt-6">
                        <Field
                            htmlFor="stock-out-product"
                            label="Product"
                            required
                            error={errors.product_id}
                        >
                            <Select
                                id="stock-out-product"
                                value={data.product_id}
                                onChange={(event) => {
                                    setData('product_id', event.target.value);
                                    setData('quantity', '');
                                    clearErrors('product_id', 'quantity');
                                }}
                                required
                            >
                                <option value="">Select a product</option>
                                {products.map((product) => {
                                    const unavailable = !product.selectable;

                                    return (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                            disabled={unavailable}
                                        >
                                            {product.name} ({product.sku}) —{' '}
                                            {unavailable
                                                ? product.is_active
                                                    ? 'Out of stock'
                                                    : 'Inactive'
                                                : `${product.quantity} available`}
                                        </option>
                                    );
                                })}
                            </Select>
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                htmlFor="stock-out-available"
                                label="Available Stock"
                            >
                                <Input
                                    id="stock-out-available"
                                    value={selectedProduct?.quantity ?? ''}
                                    placeholder="Select a product"
                                    readOnly
                                    disabled
                                />
                            </Field>
                            <Field
                                htmlFor="stock-out-quantity"
                                label="Quantity"
                                required
                                hint={
                                    selectedProduct
                                        ? `Maximum ${selectedProduct.quantity}`
                                        : undefined
                                }
                                error={errors.quantity}
                            >
                                <Input
                                    id="stock-out-quantity"
                                    type="number"
                                    min="1"
                                    max={selectedProduct?.quantity}
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
                            htmlFor="stock-out-reason"
                            label="Reason"
                            required
                            error={errors.reason}
                        >
                            <Select
                                id="stock-out-reason"
                                value={data.reason}
                                onChange={(event) => {
                                    setData(
                                        'reason',
                                        event.target
                                            .value as StockOutForm['reason'],
                                    );
                                    clearErrors('reason', 'reference');
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
                            htmlFor="stock-out-reference"
                            label={
                                data.reason === 'Customer Sale'
                                    ? 'Reference'
                                    : 'Recipient / Reference'
                            }
                            required={requiresReference}
                            hint={
                                requiresReference
                                    ? 'Required for internal requests'
                                    : data.reason === 'Customer Sale'
                                      ? 'Optional sale or invoice reference'
                                      : 'Optional'
                            }
                            error={errors.reference}
                        >
                            <Input
                                id="stock-out-reference"
                                value={data.reference}
                                onChange={(event) => {
                                    setData('reference', event.target.value);
                                    clearErrors('reference');
                                }}
                                placeholder={
                                    requiresReference
                                        ? 'Recipient or request reference'
                                        : 'Sale number or reference'
                                }
                                required={requiresReference}
                                maxLength={255}
                            />
                        </Field>

                        <Field
                            htmlFor="stock-out-notes"
                            label="Notes"
                            hint="Optional"
                            error={errors.notes}
                        >
                            <Textarea
                                id="stock-out-notes"
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
                            <PackageMinus aria-hidden="true" />
                            {processing ? 'Recording...' : 'Record Stock Out'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

StockOut.layout = (page: ReactNode) => (
    <AppLayout title="Stock Out" headerTitle="Stock Movements">
        {page}
    </AppLayout>
);
