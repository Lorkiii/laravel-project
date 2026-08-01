import { Head, usePage } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { useSidebarNav } from '@/hooks/use-sidebar-nav';
import { cn } from '@/lib/utils';

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
    const { url } = usePage();
    const pathname = url.split('?')[0] || '/';
    const items = useSidebarNav();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!mobileOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <>
            {title ? <Head title={title} /> : null}

            <div className="flex min-h-screen flex-col bg-slate-100">
                <AppHeader
                    title={headerTitle}
                    onMenuClick={() => setMobileOpen(true)}
                />

                <div className="flex min-h-0 flex-1">
                    <div className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
                        <AppSidebar items={items} pathname={pathname} />
                    </div>

                    <div
                        className={cn(
                            'fixed inset-0 z-40 lg:hidden',
                            mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
                        )}
                    >
                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            className={cn(
                                'sidebar-drawer-backdrop absolute inset-0 bg-slate-900/40 motion-reduce:transition-none',
                                mobileOpen ? 'opacity-100' : 'opacity-0',
                            )}
                            onClick={() => setMobileOpen(false)}
                        />

                        <div
                            className={cn(
                                'sidebar-drawer-panel absolute inset-y-0 left-0 flex w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-lg motion-reduce:transition-none',
                                mobileOpen
                                    ? 'translate-x-0 opacity-100'
                                    : '-translate-x-full opacity-0',
                            )}
                        >
                            <AppSidebar
                                items={items}
                                pathname={pathname}
                                showBrand
                                className="w-full"
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </div>
                    </div>

                    <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
                        {actions ? <div className="mb-6 flex justify-end">{actions}</div> : null}
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
