import { Link } from '@inertiajs/react';

import { useAuth } from '@/hooks/use-auth';
import { loginUrl } from '@/lib/navigation/urls';

export function WelcomeHero() {
    const { app } = useAuth();
    const signInHref = loginUrl();

    return (
        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-12 sm:px-8 lg:py-20">
            <div
                className="pointer-events-none absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/50 blur-3xl sm:h-96 sm:w-96"
                aria-hidden="true"
            />

            <section className="relative max-w-2xl border-l-2 border-slate-900/80 pl-6 sm:pl-8">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
                    Stock control · Products · Operations
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                    {app.name}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    Manage your inventory efficiently and securely. Track products, monitor stock
                    levels, and keep warehouse operations organized from one place.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                        href={signInHref}
                        className="inline-flex h-11 items-center justify-center rounded-md bg-slate-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                    >
                        Get started
                    </Link>
                    <Link
                        href={signInHref}
                        className="inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                    >
                        Sign in to your account
                        <span className="ml-1" aria-hidden="true">
                            →
                        </span>
                    </Link>
                </div>
            </section>
        </main>
    );
}
