import type { ReactNode } from 'react';

import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/hooks/use-auth';
import { AuthLayout } from '@/layouts/AuthLayout';
import { forgotPasswordUrl } from '@/lib/navigation/urls';

export default function Login() {
    const { app } = useAuth();

    return (
        <LoginForm systemName={app.name} forgotPasswordHref={forgotPasswordUrl()} />
    );
}

Login.layout = (page: ReactNode) => <AuthLayout title="Sign in">{page}</AuthLayout>;
