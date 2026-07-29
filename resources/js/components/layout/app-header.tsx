import { LogOut } from 'lucide-react';

import { AppLogo } from '@/components/layout/app-logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@/hooks/use-logout';
import { getUserDisplayName } from '@/lib/auth/user';

type AppHeaderProps = {
    title?: string;
};

export function AppHeader({ title = 'Dashboard' }: AppHeaderProps) {
    const { app, user } = useAuth();
    const { logout } = useLogout();
    const displayName = getUserDisplayName(user);

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                <AppLogo title={app.name} subtitle={title} />

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-slate-900">{displayName}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
