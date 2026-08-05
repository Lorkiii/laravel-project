import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
};

export function PageHeader({
    title,
    description,
    actions,
    children,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('mb-6', className)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
                    {description ? (
                        <p className="mt-1 text-sm text-slate-500">{description}</p>
                    ) : null}
                </div>

                {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
            </div>

            {children ? <div className="mt-3">{children}</div> : null}
        </div>
    );
}
