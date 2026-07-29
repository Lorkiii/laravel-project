import type { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

type MarketingLayoutProps = PropsWithChildren<{
    title?: string;
}>;

export function MarketingLayout({ children, title = 'Welcome' }: MarketingLayoutProps) {
    return (
        <>
            <Head title={title} />

            <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-200/70 text-slate-900">
                <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_#e2e8f0_0%,_#f8fafc_42%,_#e2e8f0_100%)]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -left-24 top-24 h-[28rem] w-[28rem] rounded-full bg-slate-300/35 blur-3xl"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute -right-16 bottom-10 h-[22rem] w-[22rem] rounded-full bg-white/70 blur-3xl"
                    aria-hidden="true"
                />
                {children}
            </div>
        </>
    );
}
