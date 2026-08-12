import { ArrowLeft, Pencil } from 'lucide-react';
import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { PrefetchedLink } from '@/components/navigation/prefetched-link';
import { ProductDetailsContent } from '@/components/product/product-details-content';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/layouts/AppLayout';
import { productEditUrl, productsUrl } from '@/lib/navigation/urls';
import type { ProductDetails } from '@/types/product';

type ProductShowProps = {
    product: ProductDetails;
};

export default function ProductShow({ product }: ProductShowProps) {
    const { user } = useAuth();
    const canEdit = user?.permissions.includes('products.edit') ?? false;

    return (
        <div className="mx-auto w-full max-w-5xl">
            <PageHeader
                title={product.name}
                description={`Product details for ${product.sku}.`}
                actions={
                    <>
                        <Button variant="outline" asChild>
                            <PrefetchedLink
                                href={productsUrl()}
                                pageName="Product/Index"
                            >
                                <ArrowLeft aria-hidden="true" />
                                Back to products
                            </PrefetchedLink>
                        </Button>
                        {canEdit ? (
                            <Button asChild>
                                <PrefetchedLink
                                    href={productEditUrl(product.id)}
                                    pageName="Product/Edit"
                                >
                                    <Pencil aria-hidden="true" />
                                    Edit product
                                </PrefetchedLink>
                            </Button>
                        ) : null}
                    </>
                }
            />

            <ProductDetailsContent product={product} />
        </div>
    );
}

ProductShow.layout = (page: ReactNode) => (
    <AppLayout title="Product Details" headerTitle="Products">
        {page}
    </AppLayout>
);
