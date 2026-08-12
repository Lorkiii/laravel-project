import { Eye, MoreHorizontal, Package, Pencil, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { useRef, useState } from "react";

import { PrefetchedLink } from "@/components/navigation/prefetched-link";
import { ProductDetailsContent } from "@/components/product/product-details-content";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    productDestroyUrl,
    productEditUrl,
} from "@/lib/navigation/urls";
import type { Product, ProductDetails } from "@/types/product";

type ProductTableProps = {
    products: ProductDetails[];
    onResetFilters: () => void;
    canEdit: boolean;
    canDelete: boolean;
};

function StockBadge({ product }: { product: Product }) {
    if (product.quantity === 0) {
        return (
            <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
                Out of stock
            </Badge>
        );
    }

    if (product.quantity <= product.minimum_stock) {
        return (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
                Low stock
            </Badge>
        );
    }

    return (
        <span className="font-medium text-slate-700">{product.quantity}</span>
    );
}

export function ProductTable({
    products,
    onResetFilters,
    canEdit,
    canDelete,
}: ProductTableProps) {
    const [selectedProduct, setSelectedProduct] =
        useState<ProductDetails | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const actionButtonRefs = useRef(
        new Map<number, HTMLButtonElement>(),
    );

    const viewProduct = (product: ProductDetails) => {
        setSelectedProduct(product);
        setIsDetailsOpen(true);
    };

    const deleteProduct = (product: Product) => {
        if (
            window.confirm(
                `Delete ${product.name}? This action cannot be undone.`,
            )
        ) {
            router.delete(productDestroyUrl(product.id));
        }
    };

    return (
        <>
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead>SKU</TableHead>
                    <TableHead>Product name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.length ? (
                    products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">
                                {product.sku}
                            </TableCell>
                            <TableCell className="min-w-48">
                                <div className="font-medium text-slate-900">
                                    {product.name}
                                </div>
                                <div className="mt-0.5 max-w-56 truncate text-xs text-slate-400">
                                    {product.description}
                                </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-slate-600">
                                {product.category}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-slate-600">
                                {product.brand}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-slate-600">
                                {product.model}
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-right font-medium text-slate-700">
                                $
                                {product.price.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <StockBadge product={product} />
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={
                                        product.status === "active"
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                                            : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100"
                                    }
                                >
                                    <span
                                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${product.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                                    />
                                    {product.status === "active"
                                        ? "Active"
                                        : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            ref={(button) => {
                                                if (button) {
                                                    actionButtonRefs.current.set(
                                                        product.id,
                                                        button,
                                                    );
                                                } else {
                                                    actionButtonRefs.current.delete(
                                                        product.id,
                                                    );
                                                }
                                            }}
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500"
                                        >
                                            <MoreHorizontal aria-hidden="true" />
                                            <span className="sr-only">
                                                Actions for {product.name}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-40"
                                    >
                                        <DropdownMenuLabel>
                                            Product actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={() =>
                                                viewProduct(product)
                                            }
                                        >
                                            <Eye aria-hidden="true" />
                                            View product
                                        </DropdownMenuItem>
                                        {canEdit ? (
                                            <DropdownMenuItem asChild>
                                                <PrefetchedLink
                                                    href={productEditUrl(
                                                        product.id,
                                                    )}
                                                    pageName="Product/Edit"
                                                >
                                                    <Pencil aria-hidden="true" />
                                                    Edit product
                                                </PrefetchedLink>
                                            </DropdownMenuItem>
                                        ) : null}
                                        {canDelete ? (
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onSelect={() =>
                                                    deleteProduct(product)
                                                }
                                            >
                                                <Trash2 aria-hidden="true" />
                                                Delete product
                                            </DropdownMenuItem>
                                        ) : null}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={9} className="h-32">
                            <EmptyState
                                title="No products match your filters"
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

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                {selectedProduct ? (
                    <DialogContent
                        showCloseButton={false}
                        onCloseAutoFocus={(event) => {
                            event.preventDefault();
                            actionButtonRefs.current
                                .get(selectedProduct.id)
                                ?.focus();
                        }}
                        className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden bg-background p-0 text-foreground sm:max-w-4xl"
                    >
                        <DialogHeader className="border-b border-border px-5 py-4 sm:px-6">
                            <DialogTitle className="text-foreground">
                                {selectedProduct.name}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Complete product details for{' '}
                                {selectedProduct.sku}.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="overflow-y-auto bg-muted/30 p-4 sm:p-6">
                            <ProductDetailsContent
                                product={selectedProduct}
                            />
                        </div>

                        <DialogFooter className="border-t border-border px-5 py-4 sm:px-6">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                ) : null}
            </Dialog>
        </>
    );
}
