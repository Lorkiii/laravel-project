import type { ReactNode } from 'react';

import { WelcomeFooter } from '@/components/welcome/welcome-footer';
import { WelcomeHeader } from '@/components/welcome/welcome-header';
import { WelcomeHero } from '@/components/welcome/welcome-hero';
import { MarketingLayout } from '@/layouts/MarketingLayout';

export default function Welcome() {
    return (
        <>
            <WelcomeHeader />
            <WelcomeHero />
            <WelcomeFooter />
        </>
    );
}

Welcome.layout = (page: ReactNode) => (
    <MarketingLayout title="Welcome">{page}</MarketingLayout>
);
