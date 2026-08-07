import { Link, type InertiaLinkProps } from '@inertiajs/react';
import type { ComponentProps } from 'react';

import { preloadPage } from '@/lib/inertia/pages';

type PrefetchedLinkProps = InertiaLinkProps & {
    pageName: string;
};

export function PrefetchedLink({ pageName, onMouseEnter, onFocus, ...props }: PrefetchedLinkProps) {
    const preparePage = () => preloadPage(pageName);

    return (
        <Link
            {...props}
            prefetch
            cacheFor={['30s', '1m']}
            onMouseEnter={(event) => {
                preparePage();
                onMouseEnter?.(event);
            }}
            onFocus={(event) => {
                preparePage();
                onFocus?.(event);
            }}
        />
    );
}

export type PrefetchedLinkElementProps = ComponentProps<typeof PrefetchedLink>;
