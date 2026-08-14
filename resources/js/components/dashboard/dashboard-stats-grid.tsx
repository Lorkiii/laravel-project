import { StatCard } from '@/components/dashboard/stat-card';
import {
    buildDashboardStatCards,
    type DashboardStats,
} from '@/lib/dashboard/stats';

type DashboardStatsGridProps = {
    stats: DashboardStats;
};

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
    const cards = buildDashboardStatCards(stats);

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
                <StatCard key={card.key} card={card} />
            ))}
        </div>
    );
}
