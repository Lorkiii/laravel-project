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
    description: string;
};

const STAT_CARD_CONFIG: Array<Omit<DashboardStatCard, 'value'>> = [
    {
        key: 'products',
        label: 'Products',
        description: 'Total products in catalog',
    },
    {
        key: 'categories',
        label: 'Categories',
        description: 'Active product categories',
    },
    {
        key: 'low_stock',
        label: 'Low stock',
        description: 'Items below reorder level',
    },
    {
        key: 'movements_today',
        label: 'Movements today',
        description: 'Stock movements recorded today',
    },
];

export function buildDashboardStatCards(stats: DashboardStats): DashboardStatCard[] {
    return STAT_CARD_CONFIG.map((card) => ({
        ...card,
        value: stats[card.key],
    }));
}
