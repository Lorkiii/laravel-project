import type { ReactNode } from 'react';

import { PageHeader } from '@/components/layout/page-header';
import { AppLayout } from '@/layouts/AppLayout';

export default function ProductIndex() {
    return (
        <PageHeader
            title="Products"
            description="Manage your product catalog."
        />
    );
}

ProductIndex.layout = (page: ReactNode) => (
    <AppLayout title="Products" headerTitle="Products">
        {page}
    </AppLayout>
);
