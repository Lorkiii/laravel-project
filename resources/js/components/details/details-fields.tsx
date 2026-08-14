import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type DetailFieldItem = {
    label: string;
    value: ReactNode;
    span?: 1 | 2;
};

type DetailFieldProps = {
    label: string;
    children: ReactNode;
    className?: string;
};

export function DetailField({ label, children, className }: DetailFieldProps) {
    return (
        <div className={className}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-foreground">{children}</dd>
        </div>
    );
}

type DetailsListProps = {
    fields: DetailFieldItem[];
    className?: string;
};

export function DetailsList({ fields, className }: DetailsListProps) {
    return (
        <dl className={cn('grid gap-6 sm:grid-cols-2', className)}>
            {fields.map((field, index) => (
                <DetailField
                    key={`${field.label}-${index}`}
                    label={field.label}
                    className={field.span === 2 ? 'sm:col-span-2' : undefined}
                >
                    {field.value}
                </DetailField>
            ))}
        </dl>
    );
}
