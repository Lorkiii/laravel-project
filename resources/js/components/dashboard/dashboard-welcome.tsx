import { useAuth } from '@/hooks/use-auth';

export function DashboardWelcome() {
    const { user } = useAuth();

    return (
        <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Welcome back, {user?.first_name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
                You are signed in. Next we can add the permission-aware sidebar here.
            </p>
            {user?.roles?.length ? (
                <p className="mt-2 text-xs text-slate-500">Roles: {user.roles.join(', ')}</p>
            ) : null}
        </div>
    );
}
