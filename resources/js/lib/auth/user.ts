import type { SharedAuthUser } from '@/types/inertia';

export function getUserDisplayName(user: SharedAuthUser | null | undefined): string {
    if (!user) {
        return 'User';
    }

    const fullName = `${user.first_name} ${user.last_name}`.trim();

    return fullName || user.username || user.email;
}

export function getUserInitials(user: SharedAuthUser | null | undefined): string {
    if (!user) {
        return 'U';
    }

    const first = user.first_name?.charAt(0) ?? '';
    const last = user.last_name?.charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();

    return initials || user.email.charAt(0).toUpperCase();
}
