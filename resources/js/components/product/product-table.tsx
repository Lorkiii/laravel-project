import { MoreHorizontal, Package, Pencil, Trash2 } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Product } from '@/types/product';

type ProductTableProps = {
    products: Product[];
    onResetFilters: () => void;
};

function StockBadge({ product }: { product: Product }) {
    if (product.quantity === 0) {
        return <Badge className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50">Out of stock</Badge>;
    }

    if (product.quantity <= product.minimum_stock) {
        return <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">Low stock</Badge>;
    }

    return <span className="font-medium text-slate-700">{product.quantity}</span>;
}

export function ProductTable({ products, onResetFilters }: ProductTableProps) {
    return (
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
                    <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.length ? products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">{product.sku}</TableCell>
                        <TableCell className="min-w-48">
                            <div className="font-medium text-slate-900">{product.name}</div>
                            <div className="mt-0.5 max-w-56 truncate text-xs text-slate-400">{product.description}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-slate-600">{product.category}</TableCell>
                        <TableCell className="whitespace-nowrap text-slate-600">{product.brand}</TableCell>
                        <TableCell className="whitespace-nowrap text-slate-600">{product.model}</TableCell>
                        <TableCell className="whitespace-nowrap text-right font-medium text-slate-700">
                            ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap"><StockBadge product={product} /></TableCell>
                        <TableCell>
                            <Badge className={product.status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100'}>
                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                {product.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                        <MoreHorizontal aria-hidden="true" />
                                        <span className="sr-only">Actions for {product.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuLabel>Product actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem><Pencil aria-hidden="true" />Edit product</DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive"><Trash2 aria-hidden="true" />Delete product</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={9} className="h-32">
                            <EmptyState
                                title="No products match your filters"
                                description="Try clearing filters or changing your search to see products."
                                icon={<Package aria-hidden="true" className="h-5 w-5" />}
                                action={(
                                    <Button type="button" variant="outline" onClick={onResetFilters}>
                                        Clear filters
                                    </Button>
                                )}
                                className="py-8"
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
