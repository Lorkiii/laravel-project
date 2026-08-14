import type { UserRoleOption } from '@/types/user';

export function userRoleLabel(
    role: string | null,
    roles: UserRoleOption[],
): string {
    return roles.find((option) => option.value === role)?.label ?? role ?? '—';
}
