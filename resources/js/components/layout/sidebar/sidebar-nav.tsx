import { SidebarNavGroup } from '@/components/layout/sidebar/sidebar-nav-group';
import { SidebarNavItem } from '@/components/layout/sidebar/sidebar-nav-item';
import { isSidebarPathActive, type SidebarItem } from '@/lib/navigation/sidebar';

type SidebarNavProps = {
    items: SidebarItem[];
    pathname: string;
    onNavigate?: () => void;
};

export function SidebarNav({ items, pathname, onNavigate }: SidebarNavProps) {
    return (
        <nav aria-label="Sidebar" className="sidebar-nav-list space-y-1">
            {items.map((item) => {
                if (item.children?.length) {
                    return (
                        <SidebarNavGroup
                            key={item.id}
                            item={item}
                            pathname={pathname}
                            onNavigate={onNavigate}
                        />
                    );
                }

                if (!item.href) {
                    return null;
                }

                return (
                    <SidebarNavItem
                        key={item.id}
                        label={item.label}
                        href={item.href}
                        icon={item.icon}
                        active={isSidebarPathActive(pathname, item.href)}
                        onNavigate={onNavigate}
                    />
                );
            })}
        </nav>
    );
}
