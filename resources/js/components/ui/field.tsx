import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type FieldProps = {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    className?: string;
    htmlFor?: string;
    children: React.ReactNode;
};

export type FieldErrorProps = {
    error?: string;
    className?: string;
};

function FieldError({ error, className }: FieldErrorProps) {
    if (!error) {
        return null;
    }

    return (
        <p className={cn('mt-1 text-xs font-normal text-destructive', className)}>
            {error}
        </p>
    );
}

function Field({
    label,
    required,
    hint,
    error,
    className,
    htmlFor,
    children,
}: FieldProps) {
    return (
        <div className={className}>
            <Label
                htmlFor={htmlFor}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label}
                {required ? <span className="ml-1 text-destructive">*</span> : null}
                {hint ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {hint}
                    </span>
                ) : null}
            </Label>
            {children}
            <FieldError error={error} />
        </div>
    );
}

export { Field, FieldError };
