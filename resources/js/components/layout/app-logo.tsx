import { Package } from 'lucide-react';

import { cn } from '@/lib/utils';

type AppLogoProps = {
    title: string;
    subtitle?: string;
    className?: string;
};

export function AppLogo({ title, subtitle, className }: AppLogoProps) {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10">
                <Package className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                    {title}
                </p>
                {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
            </div>
        </div>
    );
}
