import { useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowLeftRight } from 'lucide-react';
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
    stockAdjustmentStoreUrl,
    stockMovementsUrl,
} from '@/lib/navigation/urls';
import type {
    StockAdjustmentReason,
    StockMovementProductOption,
} from '@/types/inventory';

type AdjustmentForm = {
    product_id: string;
    physical_count: string;
    reason: '' | StockAdjustmentReason;
    reference: string;
    notes: string;
};

type AdjustmentProps = {
    products: StockMovementProductOption[];
    reasons: StockAdjustmentReason[];
    selectedProductId: number | null;
};

export default function Adjustment({
    products,
    reasons,
    selectedProductId,
}: AdjustmentProps) {
    const { data, setData, post, processing, errors, clearErrors } =
        useForm<AdjustmentForm>({
            product_id: selectedProductId ? String(selectedProductId) : '',
            physical_count: '',
            reason: '',
            reference: '',
            notes: '',
        });

    const selectedProduct =
        products.find((product) => String(product.id) === data.product_id) ??
        null;
    const physicalCount = Number(data.physical_count);
    const hasValidCount =
        Number.isInteger(physicalCount) &&
        physicalCount >= 0 &&
        selectedProduct !== null &&
        physicalCount !== selectedProduct.quantity;
    const canSubmit =
        selectedProduct?.selectable === true &&
        hasValidCount &&
        data.reason !== '';

    return (
        <div className="mx-auto w-full max-w-3xl">
            <PageHeader
                title="Stock Adjustment"
                description="Correct inventory when the physical count does not match the system."
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
                    <CardTitle>Adjustment details</CardTitle>
                    <CardDescription>
                        Enter the physical count. The system calculates the
                        difference and updates stock.
                    </CardDescription>
                </CardHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!canSubmit) {
                            return;
                        }

                        post(stockAdjustmentStoreUrl());
                    }}
                >
                    <CardContent className="space-y-5 pt-6">
                        <Field
                            htmlFor="adjustment-product"
                            label="Product"
                            required
                            error={errors.product_id}
                        >
                            <Select
                                id="adjustment-product"
                                value={data.product_id}
                                onChange={(event) => {
                                    setData('product_id', event.target.value);
                                    setData('physical_count', '');
                                    clearErrors('product_id', 'physical_count');
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
                                htmlFor="adjustment-current"
                                label="Current Stock"
                            >
                                <Input
                                    id="adjustment-current"
                                    value={selectedProduct?.quantity ?? ''}
                                    placeholder="Select a product"
                                    readOnly
                                    disabled
                                />
                            </Field>
                            <Field
                                htmlFor="adjustment-physical"
                                label="Physical Count"
                                required
                                hint={
                                    selectedProduct
                                        ? `Difference will be ${
                                              Number.isInteger(physicalCount)
                                                  ? physicalCount -
                                                    selectedProduct.quantity
                                                  : '—'
                                          }`
                                        : undefined
                                }
                                error={errors.physical_count}
                            >
                                <Input
                                    id="adjustment-physical"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.physical_count}
                                    onChange={(event) => {
                                        setData(
                                            'physical_count',
                                            event.target.value,
                                        );
                                        clearErrors('physical_count');
                                    }}
                                    disabled={!selectedProduct}
                                    placeholder="0"
                                    required
                                />
                            </Field>
                        </div>

                        <Field
                            htmlFor="adjustment-reason"
                            label="Reason"
                            required
                            error={errors.reason}
                        >
                            <Select
                                id="adjustment-reason"
                                value={data.reason}
                                onChange={(event) => {
                                    setData(
                                        'reason',
                                        event.target
                                            .value as AdjustmentForm['reason'],
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
                            htmlFor="adjustment-reference"
                            label="Reference"
                            hint="Optional"
                            error={errors.reference}
                        >
                            <Input
                                id="adjustment-reference"
                                value={data.reference}
                                onChange={(event) => {
                                    setData('reference', event.target.value);
                                    clearErrors('reference');
                                }}
                                placeholder="Count sheet or correction reference"
                                maxLength={255}
                            />
                        </Field>

                        <Field
                            htmlFor="adjustment-notes"
                            label="Notes"
                            hint="Optional"
                            error={errors.notes}
                        >
                            <Textarea
                                id="adjustment-notes"
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
                            <ArrowLeftRight aria-hidden="true" />
                            {processing
                                ? 'Recording...'
                                : 'Record Adjustment'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

Adjustment.layout = (page: ReactNode) => (
    <AppLayout title="Stock Adjustment" headerTitle="Stock Movements">
        {page}
    </AppLayout>
);
