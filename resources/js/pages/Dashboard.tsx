import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { DashboardWelcome } from '@/components/dashboard/dashboard-welcome';
import { AppLayout } from '@/layouts/AppLayout';
import type { DashboardStats } from '@/lib/dashboard/stats';
import { homeUrl } from '@/lib/navigation/urls';

type DashboardProps = {
    stats: DashboardStats;
};

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <>
            <DashboardWelcome />
            <DashboardStatsGrid stats={stats} />
            <div className="mt-8">
                <Link
                    href={homeUrl()}
                    className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
                >
                    Back to welcome page
                </Link>
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout title="Dashboard">{page}</AppLayout>;
