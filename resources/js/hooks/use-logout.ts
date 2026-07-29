import { logout } from '@/lib/auth/session';

export function useLogout() {
    return {
        logout,
    };
}
