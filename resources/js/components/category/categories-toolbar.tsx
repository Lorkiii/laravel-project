import { Search, SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

type CategoriesToolbarProps = {
    search: string;
    status: string;
    sort: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onReset: () => void;
};

export function CategoriesToolbar({
    search,
    status,
    sort,
    onSearchChange,
    onStatusChange,
    onSortChange,
    onReset,
}: CategoriesToolbarProps) {
    const hasFilters = search !== '' || status !== 'all' || sort !== 'name-asc';

    return (
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1 lg:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search by name or code..."
                    aria-label="Search categories"
                    className="h-9 bg-white pl-9"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:shrink-0">
                <label className="sr-only" htmlFor="category-status-filter">Status</label>
                <Select
                    id="category-status-filter"
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value)}
                    className="h-9 bg-white"
                >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </Select>

                <label className="sr-only" htmlFor="category-sort">Sort categories</label>
                <Select
                    id="category-sort"
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value)}
                    className="h-9 bg-white"
                >
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="code-asc">Code: A to Z</option>
                    <option value="code-desc">Code: Z to A</option>
                </Select>
            </div>

            {hasFilters ? (
                <Button type="button" variant="ghost" size="sm" onClick={onReset} className="self-start text-slate-500 lg:self-auto">
                    <X aria-hidden="true" />
                    Reset
                </Button>
            ) : (
                <div className="hidden items-center gap-2 text-xs text-slate-400 lg:flex">
                    <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                    Refine results
                </div>
            )}
        </div>
    );
}
