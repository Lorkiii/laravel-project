import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';

type AccountHeaderProps = {
    roles: string[];
};

export function AccountHeader({ roles }: AccountHeaderProps) {
    return (
        <PageHeader
            title="Account"
            description="Manage your profile details and password."
        >
            {roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {roles.map((role) => (
                        <Badge key={role} variant="secondary">
                            {role}
                        </Badge>
                    ))}
                </div>
            ) : null}
        </PageHeader>
    );
}
