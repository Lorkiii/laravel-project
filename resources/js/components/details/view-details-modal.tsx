import type { ComponentProps, ReactNode } from 'react';

import {
    DetailsList,
    type DetailFieldItem,
} from '@/components/details/details-fields';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type ViewDetailsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children?: ReactNode;
    fields?: DetailFieldItem[];
    footer?: ReactNode;
    isLoading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
    onCloseAutoFocus?: ComponentProps<typeof DialogContent>['onCloseAutoFocus'];
};

export function ViewDetailsModal({
    open,
    onOpenChange,
    title,
    description,
    children,
    fields,
    footer,
    isLoading = false,
    emptyTitle = 'No details available',
    emptyDescription,
    className,
    onCloseAutoFocus,
}: ViewDetailsModalProps) {
    const hasFields = Boolean(fields?.length);
    const isEmpty = !isLoading && children == null && !hasFields;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                onCloseAutoFocus={onCloseAutoFocus}
                className={cn(
                    'max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden bg-background p-0 text-foreground sm:max-w-4xl',
                    className,
                )}
            >
                <DialogHeader className="border-b border-border px-5 py-4 sm:px-6">
                    <DialogTitle className="text-foreground">
                        {title}
                    </DialogTitle>
                    <DialogDescription
                        className={
                            description ? 'text-muted-foreground' : 'sr-only'
                        }
                    >
                        {description ?? 'View details'}
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto bg-muted/30 p-4 sm:p-6">
                    {isLoading ? (
                        <div
                            className="space-y-3"
                            aria-busy="true"
                            aria-live="polite"
                        >
                            <span className="sr-only">Loading details</span>
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                    ) : isEmpty ? (
                        <EmptyState
                            title={emptyTitle}
                            description={emptyDescription}
                            className="py-8"
                        />
                    ) : children != null ? (
                        children
                    ) : (
                        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                            <DetailsList fields={fields ?? []} />
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t border-border px-5 py-4 sm:px-6">
                    {footer}
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
