import { StatCard } from '@/components/dashboard/stat-card';
import type { DashboardStatCard } from '@/lib/dashboard/stats';
import { cn } from '@/lib/utils';

type DashboardStatsGridProps = {
    cards: DashboardStatCard[];
    columns?: 3 | 4;
};

export function DashboardStatsGrid({
    cards,
    columns = 3,
}: DashboardStatsGridProps) {
    return (
        <div
            className={cn(
                'grid gap-4 sm:grid-cols-2',
                columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
            )}
        >
            {cards.map((card) => (
                <StatCard key={card.key} card={card} />
            ))}
        </div>
    );
}
