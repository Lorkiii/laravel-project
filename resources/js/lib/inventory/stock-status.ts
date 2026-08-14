import type { StockStatus } from '@/types/inventory';

export const stockStatusMeta = {
    in_stock: {
        label: 'In Stock',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    },
    low_stock: {
        label: 'Low Stock',
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
    },
    out_of_stock: {
        label: 'Out of Stock',
        className: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-50',
    },
} satisfies Record<StockStatus, { label: string; className: string }>;
