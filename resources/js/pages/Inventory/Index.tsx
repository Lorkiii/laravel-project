import { useMemo, useState, type ReactNode } from 'react';
import { Warehouse } from 'lucide-react';

import { InventoryTable } from '@/components/inventory/inventory-table';
import { InventoryToolbar } from '@/components/inventory/inventory-toolbar';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { AppLayout } from '@/layouts/AppLayout';
import type { InventoryItem, StockStatus } from '@/types/inventory';

type InventoryIndexProps = {
    items: InventoryItem[];
};

const PAGE_SIZE = 10;

export default function InventoryIndex({ items }: InventoryIndexProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);

    const categories = useMemo(
        () =>
            [
                ...new Set(
                    items
                        .map((item) => item.category)
                        .filter((value): value is string => Boolean(value)),
                ),
            ].sort(),
        [items],
    );

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchesSearch =
                query === '' ||
                item.name.toLowerCase().includes(query) ||
                item.sku.toLowerCase().includes(query);
            const matchesCategory =
                category === 'all' || item.category === category;
            const matchesStatus =
                status === 'all' || item.stock_status === (status as StockStatus);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [category, items, search, status]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    const visibleItems = filteredItems.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
    );
    const isCatalogEmpty = items.length === 0;

    const resetFilters = () => {
        setSearch('');
        setCategory('all');
        setStatus('all');
        setPage(1);
    };

    const updateFilter =
        (setter: (value: string) => void) => (value: string) => {
            setter(value);
            setPage(1);
        };

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Inventory"
                description="Review current stock levels and status across products."
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {isCatalogEmpty ? (
                    <EmptyState
                        title="No inventory records"
                        description="Products will appear here once they have been added."
                        icon={
                            <Warehouse aria-hidden="true" className="h-5 w-5" />
                        }
                        className="py-16"
                    />
                ) : (
                    <>
                        <InventoryToolbar
                            search={search}
                            category={category}
                            status={status}
                            categories={categories}
                            onSearchChange={updateFilter(setSearch)}
                            onCategoryChange={updateFilter(setCategory)}
                            onStatusChange={updateFilter(setStatus)}
                            onReset={resetFilters}
                        />
                        <InventoryTable
                            items={visibleItems}
                            onResetFilters={resetFilters}
                        />
                        <Pagination
                            currentPage={Math.min(page, totalPages)}
                            totalPages={totalPages}
                            totalItems={filteredItems.length}
                            pageSize={PAGE_SIZE}
                            onPageChange={setPage}
                            itemLabel="products"
                        />
                    </>
                )}
            </div>
        </div>
    );
}

InventoryIndex.layout = (page: ReactNode) => (
    <AppLayout title="Inventory" headerTitle="Inventory">
        {page}
    </AppLayout>
);
