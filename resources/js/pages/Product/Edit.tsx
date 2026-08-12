import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { ProductForm } from '@/components/product/product-form';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/layouts/AppLayout';
import { productUrl } from '@/lib/navigation/urls';
import type { EditableProduct } from '@/types/product';

type ProductEditProps = {
    product: EditableProduct;
    categories: { value: string; label: string; code: string }[];
};

export default function ProductEdit({ product, categories }: ProductEditProps) {
    return (
        <div className="mx-auto w-full max-w-5xl">
            <PageHeader
                title={`Edit ${product.name}`}
                description="Update product information and inventory thresholds."
                actions={
                    <Button variant="outline" asChild>
                        <PrefetchedLink
                            href={productUrl(product.id)}
                            pageName="Product/Show"
                        >
                            <ArrowLeft aria-hidden="true" />
                            Back to product
                        </PrefetchedLink>
                    </Button>
                }
            />
            <ProductForm product={product} categories={categories} />
        </div>
    );
}

ProductEdit.layout = (page: ReactNode) => (
    <AppLayout title="Edit Product" headerTitle="Products">
        {page}
    </AppLayout>
);
