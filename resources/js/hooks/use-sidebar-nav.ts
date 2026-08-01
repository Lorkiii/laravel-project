import { useMemo } from 'react';

import { useAuth } from '@/hooks/use-auth';
import { filterSidebarNav, getSidebarNav } from '@/lib/navigation/sidebar';

export function useSidebarNav() {
    const { user } = useAuth();

    return useMemo(() => {
        const permissions = user?.permissions ?? [];

        return filterSidebarNav(getSidebarNav(), permissions);
    }, [user?.permissions]);
}
