import { DetailField } from '@/components/details/details-fields';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/formatters';
import type { CategoryDetails } from '@/types/category';

type CategoryDetailsContentProps = {
    category: CategoryDetails;
};

export function CategoryDetailsContent({
    category,
}: CategoryDetailsContentProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader className="border-b border-border">
                    <CardTitle>Category information</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <dl className="grid gap-6 sm:grid-cols-2">
                        <DetailField label="Code">
                            <span className="font-mono">{category.code}</span>
                        </DetailField>
                        <DetailField label="Name">{category.name}</DetailField>
                        <DetailField label="Status">
                            <Badge
                                className={
                                    category.status === 'active'
                                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-950'
                                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                                }
                            >
                                {category.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                        </DetailField>
                        <DetailField
                            label="Description"
                            className="sm:col-span-2"
                        >
                            <span className="whitespace-pre-wrap break-words">
                                {category.description || '—'}
                            </span>
                        </DetailField>
                    </dl>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="border-b border-border">
                    <CardTitle>Record history</CardTitle>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                    <dl className="space-y-6">
                        <DetailField label="Created by">
                            {category.creator
                                ? `${category.creator.name} (@${category.creator.username})`
                                : 'Unknown'}
                        </DetailField>
                        <DetailField label="Created">
                            {formatDateTime(category.created_at)}
                        </DetailField>
                        <DetailField label="Last updated">
                            {formatDateTime(category.updated_at)}
                        </DetailField>
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}
