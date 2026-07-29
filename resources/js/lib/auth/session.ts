import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function logout(): void {
    router.post(route('logout'));
}
