import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { AccountHeader } from '@/components/settings/account-header';
import { AccountPasswordForm } from '@/components/settings/account-password-form';
import { AccountProfileForm } from '@/components/settings/account-profile-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AppLayout } from '@/layouts/AppLayout';
import type { AccountPageProps } from '@/types/inertia';

export default function Account({ account }: AccountPageProps) {
    const { flash } = usePage().props;

    return (
        <div className="mx-auto w-full max-w-3xl">
            <AccountHeader roles={account.roles} />

            {flash.success ? (
                <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900">
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            ) : null}

            <div className="space-y-6">
                <AccountProfileForm
                    defaults={{
                        first_name: account.first_name,
                        last_name: account.last_name,
                        username: account.username,
                        email: account.email,
                        phone_number: account.phone_number ?? '',
                    }}
                />
                <AccountPasswordForm />
            </div>
        </div>
    );
}

Account.layout = (page: ReactNode) => (
    <AppLayout title="Account" headerTitle="Settings">
        {page}
    </AppLayout>
);
