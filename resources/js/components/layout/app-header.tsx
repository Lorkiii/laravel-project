import { Menu } from 'lucide-react';

import { AppLogo } from '@/components/layout/app-logo';
import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

type AppHeaderProps = {
    title?: string;
    onMenuClick?: () => void;
};

export function AppHeader({ title = 'Dashboard', onMenuClick }: AppHeaderProps) {
    const { app } = useAuth();

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

                <UserMenu />
            </div>
        </header>
    );
}
