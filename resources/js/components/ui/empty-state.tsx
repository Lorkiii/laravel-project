import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
    return (
        <div className={cn('mx-auto flex max-w-xl flex-col items-center gap-3 py-10 text-center', className)}>
            {icon ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500">
                    {icon}
                </div>
            ) : null}
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                {description ? <p className="text-sm text-slate-500">{description}</p> : null}
            </div>
            {action ? <div className="pt-1">{action}</div> : null}
        </div>
    );
}
