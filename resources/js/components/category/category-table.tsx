import { Eye, FolderTree, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import { CategoryDetailsContent } from '@/components/category/category-details-content';
import { ViewDetailsModal } from '@/components/details/view-details-modal';
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
import { EmptyState } from '@/components/ui/empty-state';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { CategoryDetails } from '@/types/category';

type CategoryTableProps = {
    categories: CategoryDetails[];
    onResetFilters: () => void;
    canEdit: boolean;
    canDelete: boolean;
};

export function CategoryTable({
    categories,
    onResetFilters,
    canEdit,
    canDelete,
}: CategoryTableProps) {
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryDetails | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const actionButtonRefs = useRef(new Map<number, HTMLButtonElement>());

    const viewCategory = (category: CategoryDetails) => {
        setSelectedCategory(category);
        setIsDetailsOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length ? (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">
                                    {category.code}
                                </TableCell>
                                <TableCell className="min-w-48 font-medium text-slate-900">
                                    {category.name}
                                </TableCell>
                                <TableCell className="max-w-72 truncate text-slate-500">
                                    {category.description || '—'}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={
                                            category.status === 'active'
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                                                : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100'
                                        }
                                    >
                                        <span
                                            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                                category.status === 'active'
                                                    ? 'bg-emerald-500'
                                                    : 'bg-slate-400'
                                            }`}
                                        />
                                        {category.status === 'active'
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                ref={(button) => {
                                                    if (button) {
                                                        actionButtonRefs.current.set(
                                                            category.id,
                                                            button,
                                                        );
                                                    } else {
                                                        actionButtonRefs.current.delete(
                                                            category.id,
                                                        );
                                                    }
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500"
                                            >
                                                <MoreHorizontal aria-hidden="true" />
                                                <span className="sr-only">
                                                    Actions for {category.name}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-44"
                                        >
                                            <DropdownMenuLabel>
                                                Category actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() =>
                                                    viewCategory(category)
                                                }
                                            >
                                                <Eye aria-hidden="true" />
                                                View category
                                            </DropdownMenuItem>
                                            {canEdit ? (
                                                <DropdownMenuItem>
                                                    <Pencil aria-hidden="true" />
                                                    Edit category
                                                </DropdownMenuItem>
                                            ) : null}
                                            {canDelete ? (
                                                <DropdownMenuItem variant="destructive">
                                                    <Trash2 aria-hidden="true" />
                                                    Delete category
                                                </DropdownMenuItem>
                                            ) : null}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32">
                                <EmptyState
                                    title="No categories match your filters"
                                    description="Try clearing filters or changing your search to see categories."
                                    icon={
                                        <FolderTree
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

            <ViewDetailsModal
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                title={selectedCategory?.name ?? 'Category details'}
                description={
                    selectedCategory
                        ? `Complete category details for ${selectedCategory.code}.`
                        : undefined
                }
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    if (selectedCategory) {
                        actionButtonRefs.current
                            .get(selectedCategory.id)
                            ?.focus();
                    }
                }}
            >
                {selectedCategory ? (
                    <CategoryDetailsContent category={selectedCategory} />
                ) : null}
            </ViewDetailsModal>
        </>
    );
}
