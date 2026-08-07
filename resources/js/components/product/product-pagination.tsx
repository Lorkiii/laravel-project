import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ProductPaginationProps = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
};

export function ProductPagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: ProductPaginationProps) {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-700">{start}</span>–<span className="font-medium text-slate-700">{end}</span> of <span className="font-medium text-slate-700">{totalItems}</span> products
            </p>
            <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <ChevronLeft aria-hidden="true" />
                    Previous
                </Button>
                <span className="min-w-20 text-center text-sm text-slate-500">Page {currentPage} of {totalPages}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                    <ChevronRight aria-hidden="true" />
                </Button>
            </div>
        </div>
    );
}
