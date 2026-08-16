import { useMemo, useState } from 'react';
import { Hash, Scale } from 'lucide-react';

import type {
    AdminMovementMixPoint,
    MovementMixMetric,
} from '@/lib/dashboard/stats';
import { cn } from '@/lib/utils';

type MovementMixChartProps = {
    points: AdminMovementMixPoint[];
    metric: MovementMixMetric;
};

type MixSeriesKey = 'stock_in' | 'stock_out' | 'adjustment';

const WIDTH = 720;
const HEIGHT = 280;
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 };

export const mixSeries = [
    {
        key: 'stock_in' as const,
        label: 'Stock In',
        color: '#10b981',
        textClassName: 'text-emerald-700',
        strokeClassName: 'stroke-emerald-500',
        fillClassName: 'fill-emerald-500',
        dashArray: undefined,
    },
    {
        key: 'stock_out' as const,
        label: 'Stock Out',
        color: '#ef4444',
        textClassName: 'text-red-700',
        strokeClassName: 'stroke-red-500',
        fillClassName: 'fill-red-500',
        dashArray: '6 4',
    },
    {
        key: 'adjustment' as const,
        label: 'Adjustment',
        color: '#f59e0b',
        textClassName: 'text-amber-700',
        strokeClassName: 'stroke-amber-500',
        fillClassName: 'fill-amber-500',
        dashArray: '2 3.5',
    },
] as const;

const metricOptions = [
    {
        id: 'quantity' as const,
        label: 'Quantity',
        hint: 'Units moved',
        icon: Scale,
    },
    {
        id: 'count' as const,
        label: 'Count',
        hint: 'Number of movements',
        icon: Hash,
    },
];

function buildLinePath(coordinates: Array<{ x: number; y: number }>): string {
    return coordinates
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');
}

export function formatMixValue(
    key: MixSeriesKey,
    value: number,
    metric: MovementMixMetric,
): string {
    if (metric === 'count' || key !== 'adjustment' || value <= 0) {
        return String(value);
    }

    return `+${value}`;
}

export function MovementMixMetricToggle({
    value,
    onChange,
}: {
    value: MovementMixMetric;
    onChange: (metric: MovementMixMetric) => void;
}) {
    return (
        <div
            role="radiogroup"
            aria-label="Switch between units moved and movement count"
            className="relative isolate grid shrink-0 grid-cols-2 rounded-full bg-slate-100 p-1 shadow-inner ring-1 ring-slate-200/80"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-md shadow-slate-900/10 ring-1 ring-black/5 transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{
                    transform:
                        value === 'count' ? 'translateX(100%)' : 'translateX(0)',
                }}
            />
            {metricOptions.map((option) => {
                const selected = value === option.id;
                const Icon = option.icon;

                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={`${option.label}: ${option.hint}`}
                        className={cn(
                            'relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
                            selected
                                ? 'text-slate-900'
                                : 'text-slate-500 hover:text-slate-700',
                        )}
                        onClick={() => onChange(option.id)}
                        onKeyDown={(event) => {
                            if (
                                event.key === 'ArrowRight' ||
                                event.key === 'ArrowLeft' ||
                                event.key === 'ArrowUp' ||
                                event.key === 'ArrowDown'
                            ) {
                                event.preventDefault();
                                onChange(
                                    value === 'quantity' ? 'count' : 'quantity',
                                );
                            }
                        }}
                    >
                        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

export function MovementMixChart({ points, metric }: MovementMixChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const chart = useMemo(() => {
        if (points.length === 0) {
            return null;
        }
        const values = points.flatMap((point) =>
            mixSeries.map((series) => point[series.key][metric]),
        );
        const dataMin = Math.min(0, ...values);
        const dataMax = Math.max(0, ...values);
        const innerWidth = WIDTH - PADDING.left - PADDING.right;
        const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
        const range = Math.max(dataMax - dataMin, 4);
        const yMin = dataMin === 0 ? 0 : dataMin - range * 0.12;
        const yMax = dataMax + range * 0.12;
        const innerBottom = PADDING.top + innerHeight;

        const xForIndex = (index: number): number =>
            PADDING.left +
            (points.length === 1
                ? innerWidth / 2
                : (index / (points.length - 1)) * innerWidth);

        const yForValue = (value: number): number =>
            PADDING.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;

        const seriesPaths = mixSeries.map((series) => ({
            key: series.key,
            path: buildLinePath(
                points.map((point, index) => ({
                    x: xForIndex(index),
                    y: yForValue(point[series.key][metric]),
                })),
            ),
        }));

        const tickValues =
            yMin < 0 ? [yMin, 0, yMax] : [0, yMax / 2, yMax];

        const ticks = tickValues.map((value, index) => ({
            value: Math.round(value),
            y: yForValue(value),
            id: index,
        }));

        return {
            seriesPaths,
            xPositions: points.map((_, index) => xForIndex(index)),
            yForValue,
            ticks,
            innerBottom,
            zeroY: yForValue(0),
            showZeroLine: yMin < 0,
        };
    }, [metric, points]);

    if (!chart) {
        return null;
    }

    const activePoint =
        activeIndex === null
            ? null
            : {
                  ...points[activeIndex],
                  x: chart.xPositions[activeIndex],
              };

    const metricLabel = metric === 'quantity' ? 'units' : 'movements';

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                role="img"
                aria-label={`Today's stock in, stock out, and adjustment ${metricLabel} by hour`}
                className="h-[220px] w-full sm:h-[280px]"
                onMouseLeave={() => setActiveIndex(null)}
                onMouseMove={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    const x =
                        ((event.clientX - bounds.left) / bounds.width) * WIDTH;
                    const nearest = chart.xPositions.reduce(
                        (closest, pointX, index) => {
                            const distance = Math.abs(pointX - x);

                            return distance < closest.distance
                                ? { index, distance }
                                : closest;
                        },
                        { index: 0, distance: Number.POSITIVE_INFINITY },
                    );

                    setActiveIndex(nearest.index);
                }}
            >
                {chart.ticks.map((tick) => (
                    <g key={tick.id}>
                        <line
                            x1={PADDING.left}
                            x2={WIDTH - PADDING.right}
                            y1={tick.y}
                            y2={tick.y}
                            className="stroke-slate-200"
                            strokeDasharray="4 4"
                        />
                        <text
                            x={PADDING.left - 8}
                            y={tick.y}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className="fill-slate-400 text-[10px]"
                        >
                            {tick.value}
                        </text>
                    </g>
                ))}

                {chart.showZeroLine ? (
                    <line
                        x1={PADDING.left}
                        x2={WIDTH - PADDING.right}
                        y1={chart.zeroY}
                        y2={chart.zeroY}
                        className="stroke-slate-400"
                        strokeWidth="1.25"
                    />
                ) : null}

                {mixSeries.map((series) => {
                    const path = chart.seriesPaths.find(
                        (item) => item.key === series.key,
                    )?.path;

                    return (
                        <path
                            key={series.key}
                            d={path}
                            fill="none"
                            className={series.strokeClassName}
                            strokeWidth="2.25"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeDasharray={series.dashArray}
                        />
                    );
                })}

                {mixSeries.map((series) =>
                    points.map((point, index) => (
                        <circle
                            key={`${series.key}-${point.hour}`}
                            cx={chart.xPositions[index]}
                            cy={chart.yForValue(point[series.key][metric])}
                            r={activeIndex === index ? 4.5 : 3}
                            className={cn(
                                series.fillClassName,
                                'stroke-white',
                            )}
                            strokeWidth="1.25"
                        />
                    )),
                )}

                {points.map((point, index) =>
                    point.hour % 3 === 0 ? (
                        <text
                            key={point.hour}
                            x={chart.xPositions[index]}
                            y={HEIGHT - 8}
                            textAnchor="middle"
                            className="fill-slate-500 text-[10px]"
                        >
                            {point.label}
                        </text>
                    ) : null,
                )}

                {activePoint ? (
                    <line
                        x1={activePoint.x}
                        x2={activePoint.x}
                        y1={PADDING.top}
                        y2={chart.innerBottom}
                        className="stroke-slate-300"
                        strokeDasharray="3 3"
                    />
                ) : null}
            </svg>

            {activePoint ? (
                <div
                    className="pointer-events-none absolute rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-sm"
                    style={{
                        left: `${Math.min(Math.max((activePoint.x / WIDTH) * 100, 14), 86)}%`,
                        top: 12,
                        transform: 'translateX(-50%)',
                    }}
                >
                    <p className="font-medium text-slate-900">
                        {activePoint.label}
                    </p>
                    {mixSeries.map((series) => (
                        <p key={series.key} className={series.textClassName}>
                            {series.label}{' '}
                            {formatMixValue(
                                series.key,
                                activePoint[series.key][metric],
                                metric,
                            )}
                        </p>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function MixSeriesSwatch({
    color,
    dashArray,
}: {
    color: string;
    dashArray?: string;
}) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 28 10"
            className="h-2.5 w-7 overflow-visible"
        >
            <line
                x1="1"
                y1="5"
                x2="27"
                y2="5"
                stroke={color}
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeDasharray={dashArray}
            />
            <circle
                cx="14"
                cy="5"
                r="3"
                fill={color}
                stroke="white"
                strokeWidth="1.25"
            />
        </svg>
    );
}
