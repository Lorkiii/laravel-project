import { z } from 'zod';

export const accountSchema = z.object({
    first_name: z.string().min(1, 'First name is required').max(255),
    last_name: z.string().min(1, 'Last name is required').max(255),
    username: z.string().min(1, 'Username is required').max(255),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(255),
    phone_number: z.string().max(255),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

export const passwordSchema = z
    .object({
        current_password: z.string().min(1, 'Current password is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        password_confirmation: z.string().min(1, 'Please confirm your password'),
    })
    .refine((values) => values.password === values.password_confirmation, {
        message: 'Passwords do not match',
        path: ['password_confirmation'],
    });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
