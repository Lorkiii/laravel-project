import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { ProductForm } from '@/components/product/product-form';
import { AppLayout } from '@/layouts/AppLayout';
import { productsUrl } from '@/lib/navigation/urls';

type ProductCreateProps = {
    categories: { value: string; label: string; code: string }[];
};

export default function ProductCreate({ categories }: ProductCreateProps) {
    return (
        <div className="mx-auto w-full max-w-5xl">
            <PageHeader
                title="Add product"
                description="Create a new product record for your inventory."
                actions={
                    <Button variant="outline" asChild>
                        <PrefetchedLink href={productsUrl()} pageName="Product/Index">
                            <ArrowLeft aria-hidden="true" />
                            Back to products
                        </PrefetchedLink>
                    </Button>
                }
            />
            <ProductForm categories={categories} />
        </div>
    );
}

ProductCreate.layout = (page: ReactNode) => (
    <AppLayout title="Add Product" headerTitle="Products">
        {page}
    </AppLayout>
);
