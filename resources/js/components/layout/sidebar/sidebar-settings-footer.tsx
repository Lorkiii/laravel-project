import { LogOut, UserCog } from 'lucide-react';

import { SidebarNavItem } from '@/components/layout/sidebar/sidebar-nav-item';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/use-logout';
import { isSidebarPathActive } from '@/lib/navigation/sidebar';
import { settingsAccountUrl } from '@/lib/navigation/urls';

type SidebarSettingsFooterProps = {
    pathname: string;
    onNavigate?: () => void;
};

export function SidebarSettingsFooter({
    pathname,
    onNavigate,
}: SidebarSettingsFooterProps) {
    const { logout } = useLogout();
    const accountHref = settingsAccountUrl();

    return (
        <div className="shrink-0 border-t border-slate-200 px-3 py-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Settings
            </p>

            <SidebarNavItem
                label="Account"
                href={accountHref}
                icon={UserCog}
                active={isSidebarPathActive(pathname, accountHref)}
                onNavigate={onNavigate}
            />

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full justify-start gap-3 transition-colors duration-200 motion-reduce:transition-none"
                onClick={logout}
            >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
            </Button>
        </div>
    );
}
