import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStatCard } from '@/lib/dashboard/stats';

type StatCardProps = {
    card: DashboardStatCard;
};

export function StatCard({ card }: StatCardProps) {
    const Icon = card.icon;
    return (
        <Card>
            <CardHeader className="pb-2">
                <Icon className={`h-6 w-6 ${card.iconClassName}`} />
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl">
                    {card.displayValue ?? card.value}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
        </Card>
    );
}
