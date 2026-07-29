import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import { LoginPage } from '@/pages/LoginPage';

const rootElement = document.getElementById('app');

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <LoginPage />
        </StrictMode>,
    );
}
