import { Link } from '@inertiajs/react';

import { AppLogo } from '@/components/layout/app-logo';
import { useAuth } from '@/hooks/use-auth';
import { loginUrl } from '@/lib/navigation/urls';

export function WelcomeHeader() {
    const { app } = useAuth();

    return (
        <header className="relative z-10 border-b border-slate-300/80 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
                <AppLogo title={app.name} />

                <Link
                    href={loginUrl()}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50"
                >
                    Sign in
                </Link>
            </div>
        </header>
    );
}
