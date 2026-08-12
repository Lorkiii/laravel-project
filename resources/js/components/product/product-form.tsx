import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PrefetchedLink } from "@/components/navigation/prefetched-link";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
    productsUrl,
    productUpdateUrl,
} from "@/lib/navigation/urls";
import type { EditableProduct, ProductFormValues } from "@/types/product";

const initialValues: ProductFormValues = {
    name: "",
    brand: "",
    model: "",
    category_id: "",
    description: "",
    price: "",
    quantity: "",
    minimum_stock: "",
    status: true,
};

type ProductFormProps = {
    categories: { value: string; label: string; code: string }[];
    product?: EditableProduct;
};

function formValues(product?: EditableProduct): ProductFormValues {
    if (!product) {
        return initialValues;
    }

    return {
        name: product.name,
        brand: product.brand,
        model: product.model,
        category_id: product.category_id,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        minimum_stock: product.minimum_stock,
        status: product.status,
    };
}

function previewSku(
    categoryCode: string,
    brand: string,
    model: string,
    fallback = "Auto-generated",
): string {
    const parts = [categoryCode, brand, model]
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => part.replace(/[^A-Za-z0-9]/g, "").toUpperCase())
        .filter(Boolean);

    return parts.length > 0 ? parts.join("-") : fallback;
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const { data, setData, post, put, processing, errors } =
        useForm<ProductFormValues>(formValues(product));

    const update = (
        field: keyof ProductFormValues,
        value: string | boolean,
    ) => {
        setData(field, value);
    };

    const selectedCategoryCode =
        categories.find((category) => category.value === data.category_id)
            ?.code ?? "";
    const skuPreview = previewSku(
        selectedCategoryCode,
        data.brand,
        data.model,
        product?.sku,
    );

    return (
        <Card>
            <CardHeader className="border-b border-slate-100">
                <CardTitle>Product information</CardTitle>
                <CardDescription>
                    {product
                        ? "Update the product details and stock thresholds."
                        : "Add the core details and stock thresholds for this product."}
                </CardDescription>
            </CardHeader>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (product) {
                        put(productUpdateUrl(product.id));
                    } else {
                        post(productsUrl());
                    }
                }}
            >
                <CardContent className="space-y-8 p-4 sm:p-6">
                    <section className="space-y-4">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field
                                label="SKU"
                                hint="Auto-generated from category code, brand, and model"
                                error={errors.name}
                            >
                                <Input
                                    value={skuPreview}
                                    disabled
                                    readOnly
                                    placeholder="Auto-generated"
                                />
                            </Field>
                            <Field
                                label="Category"
                                required
                                error={errors.category_id}
                            >
                                <Select
                                    value={data.category_id}
                                    onChange={(event) =>
                                        update("category_id", event.target.value)
                                    }
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                            <Field
                                label="Product name"
                                required
                                error={errors.name}
                            >
                                <Input
                                    value={data.name}
                                    onChange={(event) =>
                                        update("name", event.target.value)
                                    }
                                    placeholder="e.g. Wireless Keyboard"
                                />
                            </Field>

                            <Field label="Brand" error={errors.brand}>
                                <Input
                                    value={data.brand}
                                    onChange={(event) =>
                                        update("brand", event.target.value)
                                    }
                                    placeholder="e.g. Logitech"
                                />
                            </Field>
                            <Field label="Model" error={errors.model}>
                                <Input
                                    value={data.model}
                                    onChange={(event) =>
                                        update("model", event.target.value)
                                    }
                                    placeholder="e.g. K6"
                                />
                            </Field>
                            <Field
                                label="Description"
                                className="sm:col-span-2"
                                error={errors.description}
                            >
                                <Textarea
                                    value={data.description}
                                    onChange={(event) =>
                                        update(
                                            "description",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Add a short description..."
                                />
                            </Field>
                        </div>
                    </section>

                    <section className="space-y-4 border-t border-slate-100 pt-6">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">
                                Pricing and inventory
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Set the current price and stock monitoring
                                values.
                            </p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3">
                            <Field label="Price" required error={errors.price}>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(event) =>
                                        update("price", event.target.value)
                                    }
                                    placeholder="0.00"
                                />
                            </Field>
                            <Field
                                label="Quantity"
                                required
                                error={errors.quantity}
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.quantity}
                                    onChange={(event) =>
                                        update("quantity", event.target.value)
                                    }
                                    placeholder="0"
                                />
                            </Field>
                            <Field
                                label="Minimum stock"
                                required
                                hint="Low-stock alert threshold"
                                error={errors.minimum_stock}
                            >
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.minimum_stock}
                                    onChange={(event) =>
                                        update(
                                            "minimum_stock",
                                            event.target.value,
                                        )
                                    }
                                    placeholder="0"
                                />
                            </Field>
                        </div>
                    </section>

                    <section className="flex items-start gap-3 border-t border-slate-100 pt-6">
                        <input
                            id="product-status"
                            type="checkbox"
                            checked={data.status}
                            onChange={(event) =>
                                update("status", event.target.checked)
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <div>
                            <label
                                htmlFor="product-status"
                                className="text-sm font-medium text-slate-900"
                            >
                                Product is active
                            </label>
                            <p className="mt-1 text-sm text-slate-500">
                                Active products are available for inventory
                                operations.
                            </p>
                        </div>
                    </section>
                </CardContent>
                <CardFooter className="justify-between border-t border-slate-100 bg-slate-50/50 p-6 sm:px-8">
                    <Button type="button" variant="ghost" asChild>
                        <PrefetchedLink
                            href={productsUrl()}
                            pageName="Product/Index"
                        >
                            <ArrowLeft aria-hidden="true" />
                            Cancel
                        </PrefetchedLink>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        <Save aria-hidden="true" />
                        {product ? "Save changes" : "Save product"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
