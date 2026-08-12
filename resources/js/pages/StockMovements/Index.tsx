import { Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    ChevronDown,
    PackageMinus,
    PackagePlus,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AppLayout } from '@/layouts/AppLayout';
import {
    stockAdjustmentUrl,
    stockInUrl,
    stockOutUrl,
} from '@/lib/navigation/urls';
import { cn } from '@/lib/utils';
import type { StockMovement, StockMovementType } from '@/types/inventory';

type MovementTab = 'all' | StockMovementType;

type StockMovementsIndexProps = {
    movements: StockMovement[];
    canStockIn: boolean;
    canStockOut: boolean;
    canAdjust: boolean;
};

const typeMeta = {
    stock_in: {
        label: 'Stock In',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    },
    stock_out: {
        label: 'Stock Out',
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
    },
    adjustment: {
        label: 'Adjustment',
        className:
            'border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50',
    },
} satisfies Record<StockMovementType, { label: string; className: string }>;

function formatQuantity(type: StockMovementType, quantity: number): string {
    if (type === 'adjustment') {
        return quantity > 0 ? `+${quantity}` : String(quantity);
    }

    if (type === 'stock_in') {
        return `+${quantity}`;
    }

    return `-${quantity}`;
}

export default function StockMovementsIndex({
    movements,
    canStockIn,
    canStockOut,
    canAdjust,
}: StockMovementsIndexProps) {
    const [activeTab, setActiveTab] = useState<MovementTab>('all');
    const canRecord = canStockIn || canStockOut || canAdjust;

    const tabs: { id: MovementTab; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'stock_in', label: 'Stock In' },
        { id: 'stock_out', label: 'Stock Out' },
    ];

    if (canAdjust) {
        tabs.push({ id: 'adjustment', label: 'Adjustments' });
    }

    const visibleMovements = useMemo(() => {
        if (activeTab === 'all') {
            return movements;
        }

        return movements.filter((movement) => movement.type === activeTab);
    }, [activeTab, movements]);

    const emptyTitle =
        activeTab === 'all'
            ? 'No stock movements'
            : `No ${typeMeta[activeTab].label.toLowerCase()} movements`;
    const emptyDescription =
        activeTab === 'all'
            ? 'Recorded stock in, stock out, and adjustment transactions will appear here.'
            : `No ${typeMeta[activeTab].label.toLowerCase()} transactions match this filter.`;

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Stock Movements"
                description="Review stock in, stock out, and inventory adjustment history."
                actions={
                    canRecord ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button">
                                    Record Stock Movement
                                    <ChevronDown aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {canStockIn ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={stockInUrl()}>
                                            <PackagePlus aria-hidden="true" />
                                            Stock In
                                        </Link>
                                    </DropdownMenuItem>
                                ) : null}
                                {canStockOut ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={stockOutUrl()}>
                                            <PackageMinus aria-hidden="true" />
                                            Stock Out
                                        </Link>
                                    </DropdownMenuItem>
                                ) : null}
                                {canAdjust ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={stockAdjustmentUrl()}>
                                            <ArrowLeftRight aria-hidden="true" />
                                            Adjustment
                                        </Link>
                                    </DropdownMenuItem>
                                ) : null}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : undefined
                }
            >
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;

                        return (
                            <Button
                                key={tab.id}
                                type="button"
                                size="sm"
                                variant={active ? 'default' : 'outline'}
                                className={cn(!active && 'bg-white')}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>
            </PageHeader>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {visibleMovements.length === 0 ? (
                    <EmptyState
                        title={emptyTitle}
                        description={emptyDescription}
                        icon={
                            <ArrowLeftRight
                                aria-hidden="true"
                                className="h-5 w-5"
                            />
                        }
                        className="py-16"
                    />
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Date</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">
                                    Quantity
                                </TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>User</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleMovements.map((movement) => {
                                const meta = typeMeta[movement.type];

                                return (
                                    <TableRow key={movement.id}>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.created_at}
                                        </TableCell>
                                        <TableCell className="min-w-48 font-medium text-slate-900">
                                            {movement.product.name}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">
                                            {movement.product.sku}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={meta.className}>
                                                {meta.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-slate-900">
                                            {formatQuantity(
                                                movement.type,
                                                movement.quantity,
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-56 text-sm text-slate-600">
                                            {movement.reason || '—'}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {movement.recorded_by}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

StockMovementsIndex.layout = (page: ReactNode) => (
    <AppLayout title="Stock Movements" headerTitle="Stock Movements">
        {page}
    </AppLayout>
);
