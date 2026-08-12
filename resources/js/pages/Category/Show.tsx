import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import { CategoryDetailsContent } from '@/components/category/category-details-content';
import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/layouts/AppLayout';
import { categoriesUrl } from '@/lib/navigation/urls';
import type { CategoryDetails } from '@/types/category';

type CategoryShowProps = {
    category: CategoryDetails;
};

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

            <CategoryDetailsContent category={category} />
        </div>
    );
}

CategoryShow.layout = (page: ReactNode) => (
    <AppLayout title="Category Details" headerTitle="Categories">
        {page}
    </AppLayout>
);
