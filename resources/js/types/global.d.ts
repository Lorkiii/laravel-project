/// <reference types="vite/client" />

import type { AxiosInstance } from 'axios';
import type { route as routeFn } from 'ziggy-js';
import '@inertiajs/core';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof routeFn;
}

declare module '@inertiajs/core' {
    interface InertiaConfig {
        flashDataType: {
            successModal?: {
                title: string;
                description: string;
                actionLabel?: string;
            };
        };
        sharedPageProps: {
            app: {
                name: string;
            };
            auth: {
                user: {
                    id: number;
                    email: string;
                    first_name: string;
                    last_name: string;
                    username: string;
                    phone_number: string | null;
                    roles: string[];
                    permissions: string[];
                } | null;
            };
            flash: {
                success: string | null;
            };
        };
    }
}

export {};
