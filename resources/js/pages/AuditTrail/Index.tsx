import { router } from '@inertiajs/react';
import { Download, History } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AppLayout } from '@/layouts/AppLayout';
import { auditTrailExportUrl, auditTrailUrl } from '@/lib/navigation/urls';
import type {
    AuditAction,
    AuditEventRow,
    AuditSubjectType,
    AuditTrailActorOption,
    AuditTrailFilters,
} from '@/types/audit';

type AuditTrailIndexProps = {
    events: AuditEventRow[];
    filters: AuditTrailFilters;
    actors: AuditTrailActorOption[];
    canExport: boolean;
};

const actionMeta = {
    created: {
        label: 'Created',
        className:
            'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50',
    },
    updated: {
        label: 'Updated',
        className:
            'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',
    },
} satisfies Record<AuditAction, { label: string; className: string }>;

const subjectMeta = {
    product: {
        label: 'Product',
        className: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50',
    },
    category: {
        label: 'Category',
        className:
            'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50',
    },
    user: {
        label: 'User',
        className:
            'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50',
    },
} satisfies Record<AuditSubjectType, { label: string; className: string }>;

const pageSize = 10;

export default function AuditTrailIndex({
    events,
    filters,
    actors,
    canExport,
}: AuditTrailIndexProps) {
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        setPageNumber(1);
    }, [filters.period, filters.subject_type, filters.action, filters.actor_id]);

    const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
    const visibleEvents = useMemo(
        () =>
            events.slice(
                (pageNumber - 1) * pageSize,
                pageNumber * pageSize,
            ),
        [events, pageNumber],
    );

    const hasFilters =
        Number(filters.period) !== 90 ||
        filters.subject_type !== 'all' ||
        filters.action !== 'all' ||
        filters.actor_id !== 'all';

    const applyFilters = (next: Partial<AuditTrailFilters>) => {
        router.get(
            auditTrailUrl({
                period: next.period ?? filters.period,
                subject_type: next.subject_type ?? filters.subject_type,
                action: next.action ?? filters.action,
                actor_id: next.actor_id ?? filters.actor_id,
            }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <div className="mx-auto w-full max-w-[1600px]">
            <PageHeader
                title="Audit Trail"
                description="Track who created or updated products, categories, and users. Records older than 90 days are removed."
                actions={
                    canExport ? (
                        <Button asChild>
                            <a href={auditTrailExportUrl(filters)}>
                                <Download aria-hidden="true" />
                                Export PDF
                            </a>
                        </Button>
                    ) : undefined
                }
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {events.length === 0 && !hasFilters ? (
                    <EmptyState
                        title="No audit events in the last 90 days"
                        description="Product, category, and user creates and updates will appear here."
                        icon={
                            <History aria-hidden="true" className="h-5 w-5" />
                        }
                        className="py-16"
                    />
                ) : (
                    <>
                        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 p-4 lg:flex-row lg:items-center">
                            <label className="sr-only" htmlFor="audit-period">
                                Period
                            </label>
                            <Select
                                id="audit-period"
                                value={String(filters.period)}
                                onChange={(event) =>
                                    applyFilters({
                                        period: Number(event.target.value),
                                    })
                                }
                                className="h-9 bg-white lg:w-44"
                            >
                                <option value="30">Last 30 days</option>
                                <option value="60">Last 60 days</option>
                                <option value="90">Last 90 days</option>
                            </Select>

                            <label className="sr-only" htmlFor="audit-type">
                                Type
                            </label>
                            <Select
                                id="audit-type"
                                value={filters.subject_type}
                                onChange={(event) =>
                                    applyFilters({
                                        subject_type: event.target
                                            .value as AuditTrailFilters['subject_type'],
                                    })
                                }
                                className="h-9 bg-white lg:w-40"
                            >
                                <option value="all">All types</option>
                                <option value="product">Product</option>
                                <option value="category">Category</option>
                                <option value="user">User</option>
                            </Select>

                            <label className="sr-only" htmlFor="audit-action">
                                Action
                            </label>
                            <Select
                                id="audit-action"
                                value={filters.action}
                                onChange={(event) =>
                                    applyFilters({
                                        action: event.target
                                            .value as AuditTrailFilters['action'],
                                    })
                                }
                                className="h-9 bg-white lg:w-40"
                            >
                                <option value="all">All actions</option>
                                <option value="created">Created</option>
                                <option value="updated">Updated</option>
                            </Select>

                            <label className="sr-only" htmlFor="audit-actor">
                                User
                            </label>
                            <Select
                                id="audit-actor"
                                value={filters.actor_id}
                                onChange={(event) =>
                                    applyFilters({
                                        actor_id: event.target.value,
                                    })
                                }
                                className="h-9 bg-white lg:w-52"
                            >
                                <option value="all">All users</option>
                                {actors.map((actor) => (
                                    <option key={actor.id} value={String(actor.id)}>
                                        {actor.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {events.length === 0 ? (
                            <EmptyState
                                title="No audit events match these filters"
                                description="Try a different period, type, action, or user."
                                icon={
                                    <History
                                        aria-hidden="true"
                                        className="h-5 w-5"
                                    />
                                }
                                className="py-16"
                            />
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Date</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Record</TableHead>
                                            <TableHead>Changes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {visibleEvents.map((event) => {
                                            const action = actionMeta[event.action];
                                            const subject =
                                                subjectMeta[event.subject_type];

                                            return (
                                                <TableRow key={event.id}>
                                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                        {event.created_at}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap font-medium text-slate-900">
                                                        {event.actor_name}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                                        {event.actor_role || '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={action.className}
                                                        >
                                                            {action.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={subject.className}
                                                        >
                                                            {subject.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="min-w-48 text-sm text-slate-900">
                                                        {event.subject_label}
                                                    </TableCell>
                                                    <TableCell className="max-w-72 text-sm text-slate-600">
                                                        {event.changes_summary}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <Pagination
                                    currentPage={Math.min(pageNumber, totalPages)}
                                    totalPages={totalPages}
                                    totalItems={events.length}
                                    pageSize={pageSize}
                                    onPageChange={setPageNumber}
                                    itemLabel="events"
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

AuditTrailIndex.layout = (page: ReactNode) => (
    <AppLayout title="Audit Trail" headerTitle="Audit Trail">
        {page}
    </AppLayout>
);
