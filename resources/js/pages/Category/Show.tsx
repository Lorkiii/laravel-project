import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/layouts/AppLayout';
import { formatDateTime } from '@/lib/formatters';
import { categoriesUrl } from '@/lib/navigation/urls';
import type { CategoryDetails } from '@/types/category';

type CategoryShowProps = {
    category: CategoryDetails;
};

function DetailItem({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {label}
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{children}</dd>
        </div>
    );
}

export default function CategoryShow({ category }: CategoryShowProps) {
    return (
        <div className="mx-auto w-full max-w-5xl">
            <PageHeader
                title={category.name}
                description={`Category details for ${category.code}.`}
                actions={
                    <Button variant="outline" asChild>
                        <PrefetchedLink
                            href={categoriesUrl()}
                            pageName="Category/Index"
                        >
                            <ArrowLeft aria-hidden="true" />
                            Back to categories
                        </PrefetchedLink>
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle>Category information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6">
                        <dl className="grid gap-6 sm:grid-cols-2">
                            <DetailItem label="Code">
                                <span className="font-mono">{category.code}</span>
                            </DetailItem>
                            <DetailItem label="Name">{category.name}</DetailItem>
                            <DetailItem label="Status">
                                <Badge
                                    className={
                                        category.status === 'active'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                                            : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100'
                                    }
                                >
                                    {category.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </DetailItem>
                            <div className="sm:col-span-2">
                                <DetailItem label="Description">
                                    {category.description || '—'}
                                </DetailItem>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle>Record history</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6">
                        <dl className="space-y-6">
                            <DetailItem label="Created by">
                                {category.creator
                                    ? `${category.creator.name} (@${category.creator.username})`
                                    : 'Unknown'}
                            </DetailItem>
                            <DetailItem label="Created">
                                {formatDateTime(category.created_at)}
                            </DetailItem>
                            <DetailItem label="Last updated">
                                {formatDateTime(category.updated_at)}
                            </DetailItem>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

CategoryShow.layout = (page: ReactNode) => (
    <AppLayout title="Category Details" headerTitle="Categories">
        {page}
    </AppLayout>
);
