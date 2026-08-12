import { useForm } from '@inertiajs/react';
import { PackageMinus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { inventoryStockOutUrl } from '@/lib/navigation/urls';
import type { InventoryItem, StockOutReason } from '@/types/inventory';

type StockOutForm = {
    product_id: string;
    quantity: string;
    reason: '' | StockOutReason;
    reference: string;
    notes: string;
};

type StockOutDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: InventoryItem[];
    reasons: StockOutReason[];
    initialProductId: number | null;
};

const emptyForm: StockOutForm = {
    product_id: '',
    quantity: '',
    reason: '',
    reference: '',
    notes: '',
};

export function StockOutDialog({
    open,
    onOpenChange,
    items,
    reasons,
    initialProductId,
}: StockOutDialogProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
    } = useForm<StockOutForm>({
        ...emptyForm,
        product_id: initialProductId ? String(initialProductId) : '',
    });

    const selectedProduct =
        items.find((item) => String(item.id) === data.product_id) ?? null;
    const quantity = Number(data.quantity);
    const hasValidQuantity =
        selectedProduct !== null &&
        Number.isInteger(quantity) &&
        quantity >= 1 &&
        quantity <= selectedProduct.quantity;
    const requiresReference = data.reason === 'Internal Request';
    const canSubmit =
        selectedProduct?.is_active === true &&
        hasValidQuantity &&
        data.reason !== '' &&
        (!requiresReference || data.reference.trim() !== '');

    const close = () => {
        reset();
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    close();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Record Stock Out</DialogTitle>
                    <DialogDescription>
                        Remove available inventory and create an auditable stock
                        movement.
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="space-y-5"
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!canSubmit) {
                            return;
                        }

                        post(inventoryStockOutUrl(), {
                            preserveScroll: true,
                            onSuccess: close,
                        });
                    }}
                >
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
                        >
                            <option value="">Select a product</option>
                            {items.map((item) => {
                                const unavailable =
                                    !item.is_active || item.quantity === 0;

                                return (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                        disabled={unavailable}
                                    >
                                        {item.name} ({item.sku}) —{' '}
                                        {unavailable
                                            ? item.is_active
                                                ? 'Out of stock'
                                                : 'Inactive'
                                            : `${item.quantity} available`}
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
                                    event.target.value as StockOutForm['reason'],
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
                        label="Recipient / Reference"
                        required={requiresReference}
                        hint={
                            requiresReference
                                ? 'Required for internal requests'
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
                            placeholder="Recipient, sale number, or request reference"
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

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={close}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !canSubmit}
                        >
                            <PackageMinus aria-hidden="true" />
                            {processing ? 'Recording...' : 'Record Stock Out'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
