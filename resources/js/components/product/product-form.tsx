import { ArrowLeft, Save } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { productCategories } from '@/lib/product/fixtures';
import { productsUrl } from '@/lib/navigation/urls';
import type { ProductFormValues } from '@/types/product';

const initialValues: ProductFormValues = {
    name: '',
    sku: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    quantity: '',
    minimum_stock: '',
    status: true,
};

export function ProductForm() {
    const [values, setValues] = useState<ProductFormValues>(initialValues);

    const update = (field: keyof ProductFormValues, value: string | boolean) => {
        setValues((current) => ({ ...current, [field]: value }));
    };

    return (
        <Card>
            <CardHeader className="border-b border-slate-100">
                <CardTitle>Product information</CardTitle>
                <CardDescription>Add the core details and stock thresholds for this product.</CardDescription>
            </CardHeader>
            <form onSubmit={(event) => event.preventDefault()}>
                <CardContent className="space-y-8 p-6 sm:p-8">
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Basic details</h2>
                            <p className="mt-1 text-sm text-slate-500">Identify the product across your inventory.</p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Product name" required>
                                <Input value={values.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Wireless Keyboard" />
                            </Field>
                            <Field label="SKU" required hint="Must be unique">
                                <Input value={values.sku} onChange={(event) => update('sku', event.target.value)} placeholder="e.g. ACC-WK-001" />
                            </Field>
                            <Field label="Brand">
                                <Input value={values.brand} onChange={(event) => update('brand', event.target.value)} placeholder="e.g. Logitech" />
                            </Field>
                            <Field label="Category" required>
                                <Select value={values.category} onChange={(event) => update('category', event.target.value)}>
                                    <option value="">Select a category</option>
                                    {productCategories.map((category) => <option key={category} value={category}>{category}</option>)}
                                </Select>
                            </Field>
                            <Field label="Description" className="sm:col-span-2">
                                <Textarea value={values.description} onChange={(event) => update('description', event.target.value)} placeholder="Add a short description..." />
                            </Field>
                        </div>
                    </section>

                    <section className="space-y-4 border-t border-slate-100 pt-6">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">Pricing and inventory</h2>
                            <p className="mt-1 text-sm text-slate-500">Set the current price and stock monitoring values.</p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3">
                            <Field label="Price" required>
                                <Input type="number" min="0" step="0.01" value={values.price} onChange={(event) => update('price', event.target.value)} placeholder="0.00" />
                            </Field>
                            <Field label="Quantity" required>
                                <Input type="number" min="0" step="1" value={values.quantity} onChange={(event) => update('quantity', event.target.value)} placeholder="0" />
                            </Field>
                            <Field label="Minimum stock" required hint="Low-stock alert threshold">
                                <Input type="number" min="0" step="1" value={values.minimum_stock} onChange={(event) => update('minimum_stock', event.target.value)} placeholder="0" />
                            </Field>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 border-t border-slate-100 pt-6">
                        <input id="product-status" type="checkbox" checked={values.status} onChange={(event) => update('status', event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        <div>
                            <label htmlFor="product-status" className="text-sm font-medium text-slate-900">Product is active</label>
                            <p className="mt-1 text-sm text-slate-500">Active products are available for inventory operations.</p>
                        </div>
                    </section>
                </CardContent>
                <CardFooter className="justify-between border-t border-slate-100 bg-slate-50/50 p-6 sm:px-8">
                    <Button type="button" variant="ghost" asChild>
                        <PrefetchedLink href={productsUrl()} pageName="Product/Index"><ArrowLeft aria-hidden="true" />Cancel</PrefetchedLink>
                    </Button>
                    <Button type="submit"><Save aria-hidden="true" />Save product</Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function Field({ label, required, hint, className, children }: { label: string; required?: boolean; hint?: string; className?: string; children: ReactNode }) {
    return (
        <div className={className}>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}{required ? <span className="ml-1 text-red-500">*</span> : null}
                {hint ? <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span> : null}
            </label>
            {children}
        </div>
    );
}
