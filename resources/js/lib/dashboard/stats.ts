import {
    Package,
    FolderTree,
    TriangleAlert,
    ArrowLeftRight,
    type LucideIcon,
} from "lucide-react";


export type DashboardStats = {
    products: number;
    categories: number;
    low_stock: number;
    movements_today: number;
};

export type DashboardStatCard = {
    key: keyof DashboardStats;
    label: string;
    value: number;
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
        key: 'categories',
        icon: FolderTree,
        label: 'Categories',
        iconClassName: 'text-green-500',
        description: 'Active product categories',
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

export function buildDashboardStatCards(stats: DashboardStats): DashboardStatCard[] {
    return STAT_CARD_CONFIG.map((card) => ({
        ...card,
        value: stats[card.key],
    }));
}
