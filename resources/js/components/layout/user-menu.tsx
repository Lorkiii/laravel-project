import { Link } from '@inertiajs/react';
import { ChevronDown, UserCog } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { getUserDisplayName, getUserInitials } from '@/lib/auth/user';
import { settingsAccountUrl } from '@/lib/navigation/urls';

export function UserMenu() {
    const { user } = useAuth();
    const displayName = getUserDisplayName(user);
    const initials = getUserInitials(user);
    const roles = user?.roles ?? [];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    className="h-auto gap-2 px-2 py-1.5 transition-colors duration-200 motion-reduce:transition-none"
                    aria-label="Open profile menu"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-900 text-xs font-medium text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-[10rem] truncate text-sm font-medium text-slate-900 sm:inline">
                        {displayName}
                    </span>
                    <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:inline" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                        <p className="truncate text-sm font-medium text-slate-900">{displayName}</p>
                        <p className="truncate text-xs text-slate-500">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link
                        href={settingsAccountUrl()}
                        className="flex cursor-pointer items-start gap-2"
                    >
                        <UserCog className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <span className="text-sm font-medium">Account</span>
                            {roles.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {roles.map((role) => (
                                        <Badge key={role} variant="secondary">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
