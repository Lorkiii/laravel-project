import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { UserPlus, Users } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { AddUserModal } from '@/components/user/add-user-modal';
import { CreatedUserCredentialsDialog } from '@/components/user/created-user-credentials-dialog';
import { UserTable } from '@/components/user/user-table';
import { UsersToolbar } from '@/components/user/users-toolbar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/layouts/AppLayout';
import type {
    CreatedUserCredentials,
    ManagedUserDetails,
    UserRoleOption,
} from '@/types/user';

type UsersIndexProps = {
    users: ManagedUserDetails[];
    roles: UserRoleOption[];
};

export default function UsersIndex({ users, roles }: UsersIndexProps) {
    const { user } = useAuth();
    const page = usePage();
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('all');
    const [status, setStatus] = useState('all');
    const [sort, setSort] = useState('name-asc');
    const [pageNumber, setPageNumber] = useState(1);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [credentials, setCredentials] =
        useState<CreatedUserCredentials | null>(null);
    const [credentialsOpen, setCredentialsOpen] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        const payload = page.flash.createdUserCredentials;

        if (!payload) {
            return;
        }

        setCredentials(payload);
        setCredentialsOpen(true);
    }, [page.flash.createdUserCredentials]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = users.filter((item) => {
            const matchesSearch =
                query === '' ||
                item.name.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query) ||
                item.username.toLowerCase().includes(query);
            const matchesRole = role === 'all' || item.role === role;
            const matchesStatus = status === 'all' || item.status === status;

            return matchesSearch && matchesRole && matchesStatus;
        });

        return filtered.sort((left, right) => {
            if (sort === 'name-desc') {
                return right.name.localeCompare(left.name);
            }

            if (sort === 'newest') {
                return (right.created_at ?? '').localeCompare(
                    left.created_at ?? '',
                );
            }

            if (sort === 'oldest') {
                return (left.created_at ?? '').localeCompare(
                    right.created_at ?? '',
                );
            }

            return left.name.localeCompare(right.name);
        });
    }, [role, search, sort, status, users]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const visibleUsers = filteredUsers.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
    );
    const isCatalogEmpty = users.length === 0;
    const canCreate = user?.permissions.includes('users.create') ?? false;

    const resetFilters = () => {
        setSearch('');
        setRole('all');
        setStatus('all');
        setSort('name-asc');
        setPageNumber(1);
    };

    const updateFilter =
        (setter: (value: string) => void) => (value: string) => {
            setter(value);
            setPageNumber(1);
        };

    const addUserAction = canCreate ? (
        <Button type="button" onClick={() => setAddUserOpen(true)}>
            <UserPlus aria-hidden="true" />
            Add user
        </Button>
    ) : undefined;

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Users"
                description="Manage accounts, roles, and access for your inventory team."
                actions={addUserAction}
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {isCatalogEmpty ? (
                    <EmptyState
                        title="No users yet"
                        description={
                            canCreate
                                ? 'Add your first user to start managing access for your team.'
                                : 'There are no users available to view yet.'
                        }
                        icon={<Users aria-hidden="true" className="h-5 w-5" />}
                        action={addUserAction}
                        className="py-16"
                    />
                ) : (
                    <>
                        <UsersToolbar
                            search={search}
                            role={role}
                            status={status}
                            sort={sort}
                            roles={roles}
                            onSearchChange={updateFilter(setSearch)}
                            onRoleChange={updateFilter(setRole)}
                            onStatusChange={updateFilter(setStatus)}
                            onSortChange={updateFilter(setSort)}
                            onReset={resetFilters}
                        />
                        <UserTable
                            users={visibleUsers}
                            roles={roles}
                            onResetFilters={resetFilters}
                        />
                        <Pagination
                            currentPage={Math.min(pageNumber, totalPages)}
                            totalPages={totalPages}
                            totalItems={filteredUsers.length}
                            pageSize={pageSize}
                            onPageChange={setPageNumber}
                            itemLabel="users"
                        />
                    </>
                )}
            </div>

            {canCreate ? (
                <AddUserModal
                    open={addUserOpen}
                    onOpenChange={setAddUserOpen}
                    roles={roles}
                />
            ) : null}

            <CreatedUserCredentialsDialog
                credentials={credentials}
                open={credentialsOpen}
                onOpenChange={(open) => {
                    setCredentialsOpen(open);
                    if (!open) {
                        setCredentials(null);
                    }
                }}
            />
        </div>
    );
}

UsersIndex.layout = (page: ReactNode) => (
    <AppLayout title="Users" headerTitle="Users">
        {page}
    </AppLayout>
);
