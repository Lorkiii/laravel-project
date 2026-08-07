import type { LucideIcon } from 'lucide-react';

import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { cn } from '@/lib/utils';

type SidebarNavItemProps = {
    label: string;
    href: string;
    pageName: string;
    icon: LucideIcon;
    active?: boolean;
    nested?: boolean;
    onNavigate?: () => void;
};

export function SidebarNavItem({
    label,
    href,
    pageName,
    icon: Icon,
    active = false,
    nested = false,
    onNavigate,
}: SidebarNavItemProps) {
    return (
        <PrefetchedLink
            href={href}
            pageName={pageName}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-[color,background-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                nested ? 'ml-2' : '',
                active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900',
            )}
        >
            <Icon
                className={cn(
                    'h-4 w-4 shrink-0 transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600',
                )}
                aria-hidden="true"
            />
            <span className="truncate">{label}</span>
        </PrefetchedLink>
    );
}
