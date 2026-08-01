import { Badge } from '@/components/ui/badge';

type AccountHeaderProps = {
    roles: string[];
};

export function AccountHeader({ roles }: AccountHeaderProps) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Account</h1>
            <p className="mt-1 text-sm text-slate-500">
                Manage your profile details and password.
            </p>

            {roles.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                    {roles.map((role) => (
                        <Badge key={role} variant="secondary">
                            {role}
                        </Badge>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
