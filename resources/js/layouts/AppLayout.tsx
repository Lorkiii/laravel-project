import type { PropsWithChildren, ReactNode } from 'react';
import { Head } from '@inertiajs/react';

import { AppHeader } from '@/components/layout/app-header';

type AppLayoutProps = PropsWithChildren<{
    title?: string;
    headerTitle?: string;
    actions?: ReactNode;
}>;

export function AppLayout({
    children,
    title,
    headerTitle = 'Dashboard',
    actions,
}: AppLayoutProps) {
    return (
        <>
            {title ? <Head title={title} /> : null}

            <div className="min-h-screen bg-slate-100">
                <AppHeader title={headerTitle} />

                {/* Sidebar can plug in here later without rewriting pages */}
                <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6">
                    <main className="min-w-0 flex-1">
                        {actions ? <div className="mb-6 flex justify-end">{actions}</div> : null}
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
