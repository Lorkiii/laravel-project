import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
    remember: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginCredentials = {
    email: string;
    password: string;
    remember?: boolean;
};

export type AuthUser = {
    id: number | string;
    name: string;
    email: string;
};

export type LoginSuccessResponse = {
    user: AuthUser;
    token?: string;
    redirectTo?: string;
};

export type LoginErrorResponse = {
    message: string;
    errors?: Partial<Record<keyof LoginCredentials, string[]>>;
};

export type LoginResult =
    | { success: true; data: LoginSuccessResponse }
    | { success: false; error: LoginErrorResponse };
