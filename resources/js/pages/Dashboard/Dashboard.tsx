import type { ReactNode } from 'react';

import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { DashboardWelcome } from '@/components/dashboard/dashboard-welcome';
import { AppLayout } from '@/layouts/AppLayout';
import type { DashboardStats } from '@/lib/dashboard/stats';

type DashboardProps = {
    stats: DashboardStats;
};

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <>
            <DashboardWelcome />
            <DashboardStatsGrid stats={stats} />
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout title="Dashboard">{page}</AppLayout>;
