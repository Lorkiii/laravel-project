import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStatCard } from '@/lib/dashboard/stats';

type StatCardProps = {
    card: DashboardStatCard;
};

export function StatCard({ card }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-3xl">{card.value}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
        </Card>
    );
}
