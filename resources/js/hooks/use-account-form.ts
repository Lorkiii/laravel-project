import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { route } from 'ziggy-js';

import { accountSchema, type AccountFormValues } from '@/types/settings';

type UseAccountFormOptions = {
    defaults: AccountFormValues;
};

export function useAccountForm({ defaults }: UseAccountFormOptions) {
    const { errors: pageErrors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: defaults,
    });

    useEffect(() => {
        form.reset(defaults);
    }, [
        defaults.first_name,
        defaults.last_name,
        defaults.username,
        defaults.email,
        defaults.phone_number,
        form,
    ]);

    useEffect(() => {
        (['first_name', 'last_name', 'username', 'email', 'phone_number'] as const).forEach(
            (field) => {
                if (pageErrors[field]) {
                    form.setError(field, { message: String(pageErrors[field]) });
                }
            },
        );
    }, [pageErrors, form]);

    function onSubmit(values: AccountFormValues) {
        setIsSubmitting(true);

        router.patch(route('settings.account.update'), values, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof AccountFormValues, {
                        message: String(message),
                    });
                });
            },
        });
    }

    return {
        form,
        isSubmitting,
        onSubmit,
    };
}
