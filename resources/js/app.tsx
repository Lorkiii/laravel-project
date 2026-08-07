import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

import { resolvePage } from '@/lib/inertia/pages';

const appName = import.meta.env.VITE_APP_NAME ?? 'Inventory Management System';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: resolvePage,
    setup({ el, App, props }) {
        if (!el) {
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#0f172a',
    },
});
