import { LoginForm, type LoginFormProps } from '@/components/auth/login-form';
import type { LoginSuccessResponse } from '@/types/auth';

export type LoginPageProps = {
    onSuccess?: (data: LoginSuccessResponse) => void;
    forgotPasswordHref?: string;
};

export function LoginPage({ onSuccess, forgotPasswordHref }: LoginPageProps) {
    const handleSuccess: LoginFormProps['onSuccess'] = (data) => {
        onSuccess?.(data);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:px-6 lg:px-8">
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.04),_transparent_55%)]"
                aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-md">
                <LoginForm onSuccess={handleSuccess} forgotPasswordHref={forgotPasswordHref} />
            </div>
        </div>
    );
}

export default LoginPage;
