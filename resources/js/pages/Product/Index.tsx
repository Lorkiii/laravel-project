import { useMemo, useState, type ReactNode } from 'react';
import { PackagePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { ProductPagination } from '@/components/product/product-pagination';
import { ProductTable } from '@/components/product/product-table';
import { ProductsToolbar } from '@/components/product/products-toolbar';
import { AppLayout } from '@/layouts/AppLayout';
import { productCategories, productFixtures } from '@/lib/product/fixtures';
import { productCreateUrl } from '@/lib/navigation/urls';

export default function ProductIndex() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [sort, setSort] = useState('name-asc');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        const products = productFixtures.filter((product) => {
            const matchesSearch = query === '' || product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || product.category === category;
            const matchesStatus = status === 'all' || product.status === status;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        return products.toSorted((left, right) => {
            if (sort === 'name-desc') return right.name.localeCompare(left.name);
            if (sort === 'price-low') return left.price - right.price;
            if (sort === 'price-high') return right.price - left.price;
            if (sort === 'stock-low') return left.quantity - right.quantity;
            return left.name.localeCompare(right.name);
        });
    }, [category, search, sort, status]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    const resetFilters = () => {
        setSearch('');
        setCategory('all');
        setStatus('all');
        setSort('name-asc');
        setPage(1);
    };

    const updateFilter = (setter: (value: string) => void) => (value: string) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Products"
                description="Manage your product catalog and keep stock levels under control."
                actions={
                    <Button asChild>
                        <PrefetchedLink href={productCreateUrl()} pageName="Product/Create"><PackagePlus aria-hidden="true" />Add product</PrefetchedLink>
                    </Button>
                }
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <ProductsToolbar
                    search={search}
                    category={category}
                    status={status}
                    sort={sort}
                    categories={productCategories}
                    onSearchChange={updateFilter(setSearch)}
                    onCategoryChange={updateFilter(setCategory)}
                    onStatusChange={updateFilter(setStatus)}
                    onSortChange={updateFilter(setSort)}
                    onReset={resetFilters}
                />
                <ProductTable products={visibleProducts} />
                <ProductPagination
                    currentPage={Math.min(page, totalPages)}
                    totalPages={totalPages}
                    totalItems={filteredProducts.length}
                    pageSize={pageSize}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}

ProductIndex.layout = (page: ReactNode) => (
    <AppLayout title="Products" headerTitle="Products">
        {page}
    </AppLayout>
);
