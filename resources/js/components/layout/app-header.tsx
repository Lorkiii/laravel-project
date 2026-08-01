import { LogOut, Menu } from 'lucide-react';

import { AppLogo } from '@/components/layout/app-logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLogout } from '@/hooks/use-logout';
import { getUserDisplayName } from '@/lib/auth/user';

type AppHeaderProps = {
    title?: string;
    onMenuClick?: () => void;
};

export function AppHeader({ title = 'Dashboard', onMenuClick }: AppHeaderProps) {
    const { app, user } = useAuth();
    const { logout } = useLogout();
    const displayName = getUserDisplayName(user);

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white">
            <div className="flex h-full w-full items-center justify-between gap-4 px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    {onMenuClick ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0 transition-colors duration-200 motion-reduce:transition-none lg:hidden"
                            onClick={onMenuClick}
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>
                    ) : null}

                    <AppLogo title={app.name} subtitle={title} />
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-medium text-slate-900">{displayName}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="transition-colors duration-200 motion-reduce:transition-none"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
