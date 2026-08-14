import type { ReactNode } from 'react';

import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { DashboardWelcome } from '@/components/dashboard/dashboard-welcome';
import {
    StaffDashboardSections,
    type StaffRecentMovement,
} from '@/components/dashboard/staff-dashboard-sections';
import { AppLayout } from '@/layouts/AppLayout';
import type { DashboardStats, StaffStockOverview } from '@/lib/dashboard/stats';
import type { InventoryItem } from '@/types/inventory';

type DashboardProps = {
    stats: DashboardStats;
    stock_overview: StaffStockOverview | null;
    attention_items: InventoryItem[] | null;
    recent_movements: StaffRecentMovement[] | null;
};

export default function Dashboard({
    stats,
    stock_overview,
    attention_items,
    recent_movements,
}: DashboardProps) {
    return (
        <>
            <DashboardWelcome />
            <DashboardStatsGrid stats={stats} />
            {stock_overview ? (
                <StaffDashboardSections
                    stockOverview={stock_overview}
                    attentionItems={attention_items ?? []}
                    recentMovements={recent_movements ?? []}
                />
            ) : null}
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout title="Dashboard">{page}</AppLayout>;
