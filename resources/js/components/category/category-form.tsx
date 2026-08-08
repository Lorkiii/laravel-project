import { ArrowLeft, Save } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { categoriesUrl } from '@/lib/navigation/urls';
import type { CategoryFormValues } from '@/types/category';

const initialValues: CategoryFormValues = {
    code: '',
    name: '',
    description: '',
};

export function CategoryForm() {
    const [values, setValues] = useState<CategoryFormValues>(initialValues);

    const update = (field: keyof CategoryFormValues, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
    };

    return (
        <Card>
            <CardHeader className="border-b border-slate-100">
                <CardTitle>Category information</CardTitle>
                <CardDescription>
                    Add a code and name to organize products in your catalog.
                </CardDescription>
            </CardHeader>
            <form onSubmit={(event) => event.preventDefault()}>
                <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Code" required hint="Must be unique">
                            <Input
                                value={values.code}
                                onChange={(event) => update('code', event.target.value)}
                                placeholder="e.g. ACC"
                            />
                        </Field>
                        <Field label="Name" required>
                            <Input
                                value={values.name}
                                onChange={(event) => update('name', event.target.value)}
                                placeholder="e.g. Accessories"
                            />
                        </Field>
                        <Field label="Description" className="sm:col-span-2">
                            <Textarea
                                value={values.description}
                                onChange={(event) => update('description', event.target.value)}
                                placeholder="Add an optional description..."
                            />
                        </Field>
                    </div>
                </CardContent>
                <CardFooter className="justify-between border-t border-slate-100 bg-slate-50/50 p-6 sm:px-8">
                    <Button type="button" variant="ghost" asChild>
                        <PrefetchedLink href={categoriesUrl()} pageName="Category/Index">
                            <ArrowLeft aria-hidden="true" />
                            Cancel
                        </PrefetchedLink>
                    </Button>
                    <Button type="submit">
                        <Save aria-hidden="true" />
                        Save category
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

function Field({
    label,
    required,
    hint,
    className,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={className}>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
                {required ? <span className="ml-1 text-red-500">*</span> : null}
                {hint ? (
                    <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>
                ) : null}
            </label>
            {children}
        </div>
    );
}
