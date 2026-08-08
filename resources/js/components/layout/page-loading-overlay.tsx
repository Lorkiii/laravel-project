import { router } from '@inertiajs/react';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const LOADING_DELAY_MS = 250;
const EXCLUDED_PATHS = new Set(['/login', '/products/create']);

export function PageLoadingState({ children }: PropsWithChildren) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const activeVisitIdRef = useRef<string | null>(null);

    useEffect(() => {
        const clearLoadingTimer = () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };

        const removeStart = router.on('start', (event) => {
            clearLoadingTimer();
            setIsVisible(false);

            const { visit } = event.detail;
            const shouldShowLoadingState = visit.method === 'get'
                && !visit.prefetch
                && !EXCLUDED_PATHS.has(visit.url.pathname);

            if (!shouldShowLoadingState) {
                activeVisitIdRef.current = null;
                return;
            }

            activeVisitIdRef.current = visit.id;
            timeoutRef.current = window.setTimeout(() => {
                setIsVisible(true);
            }, LOADING_DELAY_MS);
        });

        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.id !== activeVisitIdRef.current) {
                return;
            }

            clearLoadingTimer();
            activeVisitIdRef.current = null;
            setIsVisible(false);
        });

        return () => {
            clearLoadingTimer();
            removeStart();
            removeFinish();
        };
    }, []);

    if (!isVisible) {
        return children;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading page content"
            className="min-h-[calc(100vh-7rem)] w-full bg-slate-100"
        >
            <span className="sr-only">Loading page content</span>
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-56 max-w-full" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} className="h-28" />
                    ))}
                </div>
                <Skeleton className="min-h-80 flex-1 rounded-xl" />
            </div>
        </div>
    );
}
