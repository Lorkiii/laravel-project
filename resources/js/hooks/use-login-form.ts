import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { route } from 'ziggy-js';

import { loginSchema, type LoginFormValues } from '@/types/auth';

export function useLoginForm() {
    const { errors: pageErrors } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    useEffect(() => {
        if (pageErrors.email) {
            form.setError('email', { message: String(pageErrors.email) });
            setServerError(String(pageErrors.email));
        }

        if (pageErrors.password) {
            form.setError('password', { message: String(pageErrors.password) });
        }
    }, [pageErrors, form]);

    function onSubmit(values: LoginFormValues) {
        setServerError(null);
        setIsSubmitting(true);

        router.post(route('login'), values, {
            onFinish: () => setIsSubmitting(false),
            onError: (errors) => {
                if (errors.email) {
                    form.setError('email', { message: String(errors.email) });
                    setServerError(String(errors.email));
                }

                if (errors.password) {
                    form.setError('password', { message: String(errors.password) });
                }
            },
        });
    }

    return {
        form,
        showPassword,
        setShowPassword,
        serverError,
        isSubmitting,
        onSubmit,
    };
}
