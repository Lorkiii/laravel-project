import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { route } from 'ziggy-js';

import { passwordSchema, type PasswordFormValues } from '@/types/settings';

export function usePasswordForm() {
    const { errors: pageErrors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            current_password: '',
            password: '',
            password_confirmation: '',
        },
    });

    useEffect(() => {
        (['current_password', 'password', 'password_confirmation'] as const).forEach((field) => {
            if (pageErrors[field]) {
                form.setError(field, { message: String(pageErrors[field]) });
            }
        });
    }, [pageErrors, form]);

    function onSubmit(values: PasswordFormValues) {
        setIsSubmitting(true);

        router.put(route('settings.account.password'), values, {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
            onSuccess: () => form.reset(),
            onError: (errors) => {
                Object.entries(errors).forEach(([field, message]) => {
                    form.setError(field as keyof PasswordFormValues, {
                        message: String(message),
                    });
                });
            },
        });
    }

    return {
        form,
        isSubmitting,
        showCurrentPassword,
        setShowCurrentPassword,
        showPassword,
        setShowPassword,
        showPasswordConfirmation,
        setShowPasswordConfirmation,
        onSubmit,
    };
}
