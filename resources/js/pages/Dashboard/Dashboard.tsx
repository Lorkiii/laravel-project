import type { ReactNode } from 'react';

import { AdminDashboardSections, type AdminRecentAdjustment } from '@/components/dashboard/admin-dashboard-sections';
import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { DashboardWelcome } from '@/components/dashboard/dashboard-welcome';
import {
    StaffDashboardSections,
    type StaffRecentMovement,
} from '@/components/dashboard/staff-dashboard-sections';
import { AppLayout } from '@/layouts/AppLayout';
import {
    buildAdminDashboardStatCards,
    buildDashboardStatCards,
    emptyAdminMovementMix,
    isAdminDashboardStats,
    type AdminDashboardStats,
    type AdminMovementMix,
    type AdminTopProduct,
    type DashboardStats,
    type StaffStockOverview,
} from '@/lib/dashboard/stats';
import type { InventoryItem } from '@/types/inventory';

type DashboardProps = {
    stats: DashboardStats | AdminDashboardStats;
    inactive_users: number | null;
    stock_overview: StaffStockOverview | null;
    attention_items: InventoryItem[] | null;
    recent_movements: StaffRecentMovement[] | null;
    movement_mix: AdminMovementMix | null;
    top_products: AdminTopProduct[] | null;
    recent_adjustments: AdminRecentAdjustment[] | null;
};

export default function Dashboard({
    stats,
    stock_overview,
    attention_items,
    recent_movements,
    movement_mix,
    top_products,
    recent_adjustments,
}: DashboardProps) {
    const isAdmin = isAdminDashboardStats(stats);

    return (
        <>
            <DashboardWelcome />
            {isAdmin ? (
                <>
                    <DashboardStatsGrid
                        cards={buildAdminDashboardStatCards(stats)}
                        columns={4}
                    />
                    <AdminDashboardSections
                        movementMix={movement_mix ?? emptyAdminMovementMix}
                        topProducts={top_products ?? []}
                        recentAdjustments={recent_adjustments ?? []}
                        recentMovements={recent_movements ?? []}
                    />
                </>
            ) : (
                <>
                    <DashboardStatsGrid
                        cards={buildDashboardStatCards(stats)}
                    />
                    {stock_overview ? (
                        <StaffDashboardSections
                            stockOverview={stock_overview}
                            attentionItems={attention_items ?? []}
                            recentMovements={recent_movements ?? []}
                        />
                    ) : null}
                </>
            )}
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout title="Dashboard">{page}</AppLayout>;
