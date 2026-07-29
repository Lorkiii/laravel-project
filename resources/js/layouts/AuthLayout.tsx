import type { PropsWithChildren } from 'react';
import { Head } from '@inertiajs/react';

type AuthLayoutProps = PropsWithChildren<{
    title?: string;
}>;

export function AuthLayout({ children, title = 'Sign in' }: AuthLayoutProps) {
    return (
        <>
            <Head title={title} />

            <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:px-6 lg:px-8">
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.04),_transparent_55%)]"
                    aria-hidden="true"
                />
                <div className="relative z-10 w-full max-w-md">{children}</div>
            </div>
        </>
    );
}
