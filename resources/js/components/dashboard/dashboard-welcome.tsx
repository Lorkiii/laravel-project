import { useAuth } from '@/hooks/use-auth';

export function DashboardWelcome() {
    const { user } = useAuth();

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back, {user?.first_name}
            </h1>

        </div>
    );
}
