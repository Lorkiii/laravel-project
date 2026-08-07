import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SidebarNavItem } from '@/components/layout/sidebar/sidebar-nav-item';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    groupContainsActivePath,
    isSidebarPathActive,
    type SidebarItem,
} from '@/lib/navigation/sidebar';
import { cn } from '@/lib/utils';

type SidebarNavGroupProps = {
    item: SidebarItem;
    pathname: string;
    onNavigate?: () => void;
};

export function SidebarNavGroup({
    item,
    pathname,
    onNavigate,
}: SidebarNavGroupProps) {
    const Icon = item.icon;
    const containsActive = groupContainsActivePath(item, pathname);
    const [open, setOpen] = useState(containsActive);

    useEffect(() => {
        if (containsActive) {
            setOpen(true);
        }
    }, [containsActive]);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger
                className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-[color,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    containsActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )}
            >
                <Icon
                    className={cn(
                        'h-4 w-4 shrink-0 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        containsActive ? 'text-slate-700' : 'text-slate-400',
                    )}
                    aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        open && 'rotate-180',
                    )}
                    aria-hidden="true"
                />
            </CollapsibleTrigger>

            <CollapsibleContent className="sidebar-collapsible-content overflow-hidden">
                <div className="mt-1 space-y-1 border-l border-slate-200 py-1 pl-2 transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    {item.children?.map((child) => {
                        if (!child.href) {
                            return null;
                        }

                        return (
                            <SidebarNavItem
                                key={child.id}
                                label={child.label}
                                href={child.href}
                                pageName={child.pageName ?? ''}
                                icon={child.icon}
                                active={isSidebarPathActive(pathname, child.href)}
                                nested
                                onNavigate={onNavigate}
                            />
                        );
                    })}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
