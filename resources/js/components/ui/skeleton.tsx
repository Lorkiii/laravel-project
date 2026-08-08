import * as React from 'react';

import { cn } from '@/lib/utils';

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, 'aria-hidden': ariaHidden = true, ...props }, ref) => (
        <div
            ref={ref}
            aria-hidden={ariaHidden}
            className={cn('animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)}
            {...props}
        />
    ),
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
