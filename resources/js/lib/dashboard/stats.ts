import {
    ArrowLeftRight,
    Banknote,
    Package,
    TriangleAlert,
    type LucideIcon,
} from 'lucide-react';

export type DashboardStats = {
    products: number;
    low_stock: number;
    movements_today: number;
};

export type AdminDashboardStats = {
    products: number;
    needs_attention: number;
    inventory_value: number;
    adjustments_today: number;
};

export type StockTrendPoint = {
    date: string;
    label: string;
    stock_in: number;
    stock_out: number;
};

export type StaffStockOverview = {
    total_quantity: number;
    in_stock_count: number;
    out_of_stock_count: number;
    trend: StockTrendPoint[];
};

export type MovementMixMetric = 'quantity' | 'count';

export type MovementMixMetrics = {
    quantity: number;
    count: number;
};

export type AdminMovementMixPoint = {
    hour: number;
    label: string;
    stock_in: MovementMixMetrics;
    stock_out: MovementMixMetrics;
    adjustment: MovementMixMetrics;
};

export type AdminMovementMix = {
    totals: {
        stock_in: MovementMixMetrics;
        stock_out: MovementMixMetrics;
        adjustment: MovementMixMetrics;
    };
    points: AdminMovementMixPoint[];
};

export const emptyAdminMovementMix: AdminMovementMix = {
    totals: {
        stock_in: { quantity: 0, count: 0 },
        stock_out: { quantity: 0, count: 0 },
        adjustment: { quantity: 0, count: 0 },
    },
    points: [],
};

export type AdminTopProduct = {
    id: number;
    name: string;
    sku: string;
    movement_count: number;
};

export type DashboardStatCard = {
    key: string;
    label: string;
    value: number;
    displayValue?: string;
    icon: LucideIcon;
    iconClassName?: string;
    description: string;
};

const STAT_CARD_CONFIG: Array<Omit<DashboardStatCard, 'value'>> = [
    {
        key: 'products',
        icon: Package,
        label: 'Products',
        iconClassName: 'text-blue-500',
        description: 'Total products in catalog',
    },
    {
        key: 'low_stock',
        icon: TriangleAlert,
        label: 'Low stock',
        iconClassName: 'text-yellow-500',
        description: 'Items below reorder level',
    },
    {
        key: 'movements_today',
        icon: ArrowLeftRight,
        label: 'Movements today',
        iconClassName: 'text-red-500',
        description: 'Stock movements recorded today',
    },
];

export function isAdminDashboardStats(
    stats: DashboardStats | AdminDashboardStats,
): stats is AdminDashboardStats {
    return 'inventory_value' in stats && 'adjustments_today' in stats;
}

export function buildDashboardStatCards(stats: DashboardStats): DashboardStatCard[] {
    return STAT_CARD_CONFIG.map((card) => ({
        ...card,
        value: stats[card.key as keyof DashboardStats],
    }));
}

function formatInventoryValue(value: number): string {
    return `$${value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
    })}`;
}

export function buildAdminDashboardStatCards(
    stats: AdminDashboardStats,
): DashboardStatCard[] {
    return [
        {
            key: 'products',
            icon: Package,
            label: 'Products',
            iconClassName: 'text-blue-500',
            description: 'Total products in catalog',
            value: stats.products,
        },
        {
            key: 'needs_attention',
            icon: TriangleAlert,
            label: 'Needs attention',
            iconClassName: 'text-yellow-500',
            description: 'Low and out of stock products',
            value: stats.needs_attention,
        },
        {
            key: 'inventory_value',
            icon: Banknote,
            label: 'Inventory value',
            iconClassName: 'text-emerald-600',
            description: 'Current stock at listed prices',
            value: stats.inventory_value,
            displayValue: formatInventoryValue(stats.inventory_value),
        },
        {
            key: 'adjustments_today',
            icon: ArrowLeftRight,
            label: 'Adjustments today',
            iconClassName: 'text-amber-500',
            description: 'Stock corrections recorded today',
            value: stats.adjustments_today,
        },
    ];
}
