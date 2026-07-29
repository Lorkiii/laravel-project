import { usePage } from '@inertiajs/react';

import type { SharedAuthUser } from '@/types/inertia';

export function useAuth() {
    const { auth, app } = usePage().props;

    return {
        app,
        user: auth.user as SharedAuthUser | null,
        isAuthenticated: Boolean(auth.user),
    };
}
