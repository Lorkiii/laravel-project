import { useMemo, useState, type ReactNode } from 'react';
import { FolderPlus, FolderTree } from 'lucide-react';

import { CategoriesToolbar } from '@/components/category/categories-toolbar';
import { CategoryTable } from '@/components/category/category-table';
import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/layouts/AppLayout';
import { categoryCreateUrl } from '@/lib/navigation/urls';
import type { CategoryDetails } from '@/types/category';

type CategoryIndexProps = {
    categories: CategoryDetails[];
};

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [sort, setSort] = useState('name-asc');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = categories.filter((category) => {
            const matchesSearch =
                query === '' ||
                category.name.toLowerCase().includes(query) ||
                category.code.toLowerCase().includes(query);
            const matchesStatus = status === 'all' || category.status === status;
            return matchesSearch && matchesStatus;
        });

        return filtered.sort((left, right) => {
            if (sort === 'name-desc') return right.name.localeCompare(left.name);
            if (sort === 'code-asc') return left.code.localeCompare(right.code);
            if (sort === 'code-desc') return right.code.localeCompare(left.code);
            return left.name.localeCompare(right.name);
        });
    }, [categories, search, sort, status]);

    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
    const visibleCategories = filteredCategories.slice((page - 1) * pageSize, page * pageSize);
    const isCatalogEmpty = categories.length === 0;

    const resetFilters = () => {
        setSearch('');
        setStatus('all');
        setSort('name-asc');
        setPage(1);
    };

    const updateFilter = (setter: (value: string) => void) => (value: string) => {
        setter(value);
        setPage(1);
    };

    const canCreate = user?.permissions.includes('categories.create') ?? false;
    const canEdit = user?.permissions.includes('categories.edit') ?? false;
    const canDelete = user?.permissions.includes('categories.delete') ?? false;
    const addCategoryAction = canCreate ? (
        <Button asChild>
            <PrefetchedLink href={categoryCreateUrl()} pageName="Category/Create">
                <FolderPlus aria-hidden="true" />
                Add category
            </PrefetchedLink>
        </Button>
    ) : undefined;

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Categories"
                description="Organize your catalog with clear category codes and names."
                actions={addCategoryAction}
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {isCatalogEmpty ? (
                    <EmptyState
                        title="No categories yet"
                        description={
                            canCreate
                                ? 'Add your first category to start organizing products in your catalog.'
                                : 'There are no categories available to view yet.'
                        }
                        icon={<FolderTree aria-hidden="true" className="h-5 w-5" />}
                        action={addCategoryAction}
                        className="py-16"
                    />
                ) : (
                    <>
                        <CategoriesToolbar
                            search={search}
                            status={status}
                            sort={sort}
                            onSearchChange={updateFilter(setSearch)}
                            onStatusChange={updateFilter(setStatus)}
                            onSortChange={updateFilter(setSort)}
                            onReset={resetFilters}
                        />
                        <CategoryTable
                            categories={visibleCategories}
                            onResetFilters={resetFilters}
                            canEdit={canEdit}
                            canDelete={canDelete}
                        />
                        <Pagination
                            currentPage={Math.min(page, totalPages)}
                            totalPages={totalPages}
                            totalItems={filteredCategories.length}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            itemLabel="categories"
                        />
                    </>
                )}
            </div>
        </div>
    );
}

CategoryIndex.layout = (page: ReactNode) => (
    <AppLayout title="Categories" headerTitle="Categories">
        {page}
    </AppLayout>
);
