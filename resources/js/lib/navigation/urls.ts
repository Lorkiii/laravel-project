import { route } from 'ziggy-js';

export function loginUrl(): string {
    return route('login');
}

export function homeUrl(): string {
    return route('home');
}

export function dashboardUrl(): string {
    return route('dashboard');
}

export function forgotPasswordUrl(): string | undefined {
    return route().has('password.request') ? route('password.request') : undefined;
}
