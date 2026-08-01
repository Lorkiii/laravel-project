import { AppLogo } from '@/components/layout/app-logo';
import { SidebarNav } from '@/components/layout/sidebar/sidebar-nav';
import { SidebarSettingsFooter } from '@/components/layout/sidebar/sidebar-settings-footer';
import { useAuth } from '@/hooks/use-auth';
import type { SidebarItem } from '@/lib/navigation/sidebar';
import { cn } from '@/lib/utils';

type AppSidebarProps = {
    items: SidebarItem[];
    pathname: string;
    className?: string;
    showBrand?: boolean;
    onNavigate?: () => void;
};

export function AppSidebar({
    items,
    pathname,
    className,
    showBrand = false,
    onNavigate,
}: AppSidebarProps) {
    const { app } = useAuth();

    return (
        <aside
            className={cn(
                'sidebar-panel flex h-full w-full flex-col bg-white',
                className,
            )}
        >
            {showBrand ? (
                <div className="border-b border-slate-200 px-4 py-4">
                    <AppLogo title={app.name} subtitle="Navigation" />
                </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
                <SidebarNav items={items} pathname={pathname} onNavigate={onNavigate} />
            </div>

            <SidebarSettingsFooter pathname={pathname} onNavigate={onNavigate} />
        </aside>
    );
}
