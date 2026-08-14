import { Eye, MoreHorizontal, Users } from 'lucide-react';
import { useRef, useState } from 'react';

import { ViewDetailsModal } from '@/components/details/view-details-modal';
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
import { EmptyState } from '@/components/ui/empty-state';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/lib/formatters';
import { userRoleLabel } from '@/lib/user/roles';
import type { ManagedUserDetails, UserRoleOption } from '@/types/user';

type UserTableProps = {
    users: ManagedUserDetails[];
    roles: UserRoleOption[];
    onResetFilters: () => void;
};

function StatusBadge({ status }: { status: ManagedUserDetails['status'] }) {
    return (
        <Badge
            className={
                status === 'active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                    : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100'
            }
        >
            <span
                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                    status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
            />
            {status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
    );
}

export function UserTable({ users, roles, onResetFilters }: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<ManagedUserDetails | null>(
        null,
    );
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const actionButtonRefs = useRef(new Map<number, HTMLButtonElement>());

    const viewUser = (user: ManagedUserDetails) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-12">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length ? (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="min-w-40 font-medium text-slate-900">
                                    {user.name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">
                                    {user.username}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-slate-600">
                                    {user.email}
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-slate-600">
                                    {userRoleLabel(user.role, roles)}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={user.status} />
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-slate-500">
                                    {formatDateTime(user.created_at)}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                ref={(button) => {
                                                    if (button) {
                                                        actionButtonRefs.current.set(
                                                            user.id,
                                                            button,
                                                        );
                                                    } else {
                                                        actionButtonRefs.current.delete(
                                                            user.id,
                                                        );
                                                    }
                                                }}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500"
                                            >
                                                <MoreHorizontal aria-hidden="true" />
                                                <span className="sr-only">
                                                    Actions for {user.name}
                                                </span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40"
                                        >
                                            <DropdownMenuLabel>
                                                User actions
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => viewUser(user)}
                                            >
                                                <Eye aria-hidden="true" />
                                                View user
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32">
                                <EmptyState
                                    title="No users match your filters"
                                    description="Try clearing filters or changing your search to see users."
                                    icon={
                                        <Users
                                            aria-hidden="true"
                                            className="h-5 w-5"
                                        />
                                    }
                                    action={
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onResetFilters}
                                        >
                                            Clear filters
                                        </Button>
                                    }
                                    className="py-8"
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ViewDetailsModal
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                title={selectedUser?.name ?? 'User details'}
                description={
                    selectedUser
                        ? `Account details for ${selectedUser.email}.`
                        : undefined
                }
                fields={
                    selectedUser
                        ? [
                              { label: 'Name', value: selectedUser.name },
                              {
                                  label: 'Username',
                                  value: selectedUser.username,
                              },
                              { label: 'Email', value: selectedUser.email },
                              {
                                  label: 'Phone',
                                  value: selectedUser.phone_number || '—',
                              },
                              {
                                  label: 'Role',
                                  value: userRoleLabel(selectedUser.role, roles),
                              },
                              {
                                  label: 'Status',
                                  value: (
                                      <StatusBadge
                                          status={selectedUser.status}
                                      />
                                  ),
                              },
                              {
                                  label: 'Created',
                                  value: formatDateTime(selectedUser.created_at),
                              },
                              {
                                  label: 'Last updated',
                                  value: formatDateTime(selectedUser.updated_at),
                              },
                          ]
                        : []
                }
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    if (selectedUser) {
                        actionButtonRefs.current.get(selectedUser.id)?.focus();
                    }
                }}
            />
        </>
    );
}
