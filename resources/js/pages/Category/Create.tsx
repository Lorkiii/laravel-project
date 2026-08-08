import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import { CategoryForm } from '@/components/category/category-form';
import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/layouts/AppLayout';
import { categoriesUrl } from '@/lib/navigation/urls';

export default function CategoryCreate() {
    return (
        <div className="mx-auto w-full max-w-5xl">
            <PageHeader
                title="Add category"
                description="Create a new category for organizing your product catalog."
                actions={
                    <Button variant="outline" asChild>
                        <PrefetchedLink href={categoriesUrl()} pageName="Category/Index">
                            <ArrowLeft aria-hidden="true" />
                            Back to categories
                        </PrefetchedLink>
                    </Button>
                }
            />
            <CategoryForm />
        </div>
    );
}

CategoryCreate.layout = (page: ReactNode) => (
    <AppLayout title="Add Category" headerTitle="Categories">
        {page}
    </AppLayout>
);
