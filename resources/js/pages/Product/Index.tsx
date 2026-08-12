import { useMemo, useState, type ReactNode } from "react";
import { Package, PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { PrefetchedLink } from "@/components/navigation/prefetched-link";
import { ProductTable } from "@/components/product/product-table";
import { ProductsToolbar } from "@/components/product/products-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/layouts/AppLayout";
import { productCreateUrl } from "@/lib/navigation/urls";
import type { ProductDetails } from "@/types/product";

type ProductIndexProps = {
    products: ProductDetails[];
};

export default function ProductIndex({ products }: ProductIndexProps) {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("name-asc");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = products.filter((product) => {
            const matchesSearch =
                query === "" ||
                product.name.toLowerCase().includes(query) ||
                product.sku.toLowerCase().includes(query);
            const matchesCategory =
                category === "all" || product.category === category;
            const matchesStatus = status === "all" || product.status === status;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        return filtered.sort((left, right) => {
            if (sort === "name-desc")
                return right.name.localeCompare(left.name);
            if (sort === "price-low") return left.price - right.price;
            if (sort === "price-high") return right.price - left.price;
            if (sort === "stock-low") return left.quantity - right.quantity;
            return left.name.localeCompare(right.name);
        });
    }, [category, products, search, sort, status]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / pageSize),
    );
    const visibleProducts = filteredProducts.slice(
        (page - 1) * pageSize,
        page * pageSize,
    );
    const isCatalogEmpty = products.length === 0;
    const categories = [
        ...new Set(products.map((product) => product.category)),
    ].sort();

    const resetFilters = () => {
        setSearch("");
        setCategory("all");
        setStatus("all");
        setSort("name-asc");
        setPage(1);
    };

    const updateFilter =
        (setter: (value: string) => void) => (value: string) => {
            setter(value);
            setPage(1);
        };

    const canCreate = user?.permissions.includes("products.create") ?? false;
    const canEdit = user?.permissions.includes("products.edit") ?? false;
    const canDelete = user?.permissions.includes("products.delete") ?? false;
    const addProductAction = canCreate ? (
        <Button asChild>
            <PrefetchedLink href={productCreateUrl()} pageName="Product/Create">
                <PackagePlus aria-hidden="true" />
                Add product
            </PrefetchedLink>
        </Button>
    ) : undefined;

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Products"
                description="Manage your product catalog and keep stock levels under control."
                actions={addProductAction}
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {isCatalogEmpty ? (
                    <EmptyState
                        title="No products yet"
                        description={
                            canCreate
                                ? "Add your first product to start building your catalog and tracking stock."
                                : "There are no products available to view yet."
                        }
                        icon={
                            <Package aria-hidden="true" className="h-5 w-5" />
                        }
                        action={addProductAction}
                        className="py-16"
                    />
                ) : (
                    <>
                        <ProductsToolbar
                            search={search}
                            category={category}
                            status={status}
                            sort={sort}
                            categories={categories}
                            onSearchChange={updateFilter(setSearch)}
                            onCategoryChange={updateFilter(setCategory)}
                            onStatusChange={updateFilter(setStatus)}
                            onSortChange={updateFilter(setSort)}
                            onReset={resetFilters}
                        />
                        <ProductTable
                            products={visibleProducts}
                            onResetFilters={resetFilters}
                            canEdit={canEdit}
                            canDelete={canDelete}
                        />
                        <Pagination
                            currentPage={Math.min(page, totalPages)}
                            totalPages={totalPages}
                            totalItems={filteredProducts.length}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            itemLabel="products"
                        />
                    </>
                )}
            </div>
        </div>
    );
}

ProductIndex.layout = (page: ReactNode) => (
    <AppLayout title="Products" headerTitle="Products">
        {page}
    </AppLayout>
);
