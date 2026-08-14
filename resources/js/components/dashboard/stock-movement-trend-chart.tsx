import { useId, useMemo, useState } from 'react';

import type { StockTrendPoint } from '@/lib/dashboard/stats';

type StockMovementTrendChartProps = {
    points: StockTrendPoint[];
};

const WIDTH = 640;
const HEIGHT = 280;
const PADDING = { top: 16, right: 16, bottom: 28, left: 36 };

function buildPath(
    coordinates: Array<{ x: number; y: number }>,
    innerBottom: number,
): { linePath: string; areaPath: string } {
    const linePath = coordinates
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
        .join(' ');
    const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${innerBottom} L ${coordinates[0].x} ${innerBottom} Z`;

    return { linePath, areaPath };
}

export function StockMovementTrendChart({ points }: StockMovementTrendChartProps) {
    const stockInGradientId = useId();
    const stockOutGradientId = useId();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const chart = useMemo(() => {
        const values = points.flatMap((point) => [point.stock_in, point.stock_out]);
        const maxQuantity = Math.max(...values, 0);
        const innerWidth = WIDTH - PADDING.left - PADDING.right;
        const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
        const yMax = Math.max(maxQuantity * 1.15, 4);
        const innerBottom = PADDING.top + innerHeight;

        const xForIndex = (index: number): number =>
            PADDING.left +
            (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);

        const yForValue = (value: number): number =>
            PADDING.top + innerHeight - (value / yMax) * innerHeight;

        const stockInCoordinates = points.map((point, index) => ({
            x: xForIndex(index),
            y: yForValue(point.stock_in),
        }));
        const stockOutCoordinates = points.map((point, index) => ({
            x: xForIndex(index),
            y: yForValue(point.stock_out),
        }));

        const ticks = [0, yMax / 2, yMax].map((value) => ({
            value: Math.round(value),
            y: yForValue(value),
        }));

        return {
            stockIn: buildPath(stockInCoordinates, innerBottom),
            stockOut: buildPath(stockOutCoordinates, innerBottom),
            xPositions: points.map((_, index) => xForIndex(index)),
            ticks,
            innerBottom,
        };
    }, [points]);

    const activePoint =
        activeIndex === null
            ? null
            : {
                  ...points[activeIndex],
                  x: chart.xPositions[activeIndex],
              };

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                role="img"
                aria-label="Stock in versus stock out over the last 7 days"
                className="h-[280px] w-full"
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
                <defs>
                    <linearGradient id={stockInGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id={stockOutGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {chart.ticks.map((tick) => (
                    <g key={tick.value}>
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

                <path d={chart.stockIn.areaPath} fill={`url(#${stockInGradientId})`} />
                <path d={chart.stockOut.areaPath} fill={`url(#${stockOutGradientId})`} />
                <path
                    d={chart.stockIn.linePath}
                    fill="none"
                    className="stroke-emerald-500"
                    strokeWidth="2.25"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                <path
                    d={chart.stockOut.linePath}
                    fill="none"
                    className="stroke-red-500"
                    strokeWidth="2.25"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {points.map((point, index) => (
                    <text
                        key={point.date}
                        x={chart.xPositions[index]}
                        y={HEIGHT - 8}
                        textAnchor="middle"
                        className="fill-slate-500 text-[10px]"
                    >
                        {point.label}
                    </text>
                ))}

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
                        left: `${(activePoint.x / WIDTH) * 100}%`,
                        top: 12,
                        transform: 'translateX(-50%)',
                    }}
                >
                    <p className="font-medium text-slate-900">{activePoint.label}</p>
                    <p className="text-emerald-700">Stock In {activePoint.stock_in}</p>
                    <p className="text-red-700">Stock Out {activePoint.stock_out}</p>
                </div>
            ) : null}
        </div>
    );
}
