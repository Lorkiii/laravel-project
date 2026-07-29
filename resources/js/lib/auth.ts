import type { LoginCredentials, LoginResult } from '@/types/auth';

/**
 * Authenticate against the API.
 * Replace the mock delay with your real auth endpoint (e.g. Sanctum /login).
 */
export async function loginRequest(credentials: LoginCredentials): Promise<LoginResult> {
    // Example integration target:
    // const response = await window.axios.post('/login', credentials);
    // return { success: true, data: response.data };

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!credentials.email || !credentials.password) {
        return {
            success: false,
            error: {
                message: 'Invalid credentials. Please try again.',
            },
        };
    }

    return {
        success: true,
        data: {
            user: {
                id: 1,
                name: 'Inventory User',
                email: credentials.email,
            },
            // Set redirectTo once your post-login route exists, e.g. '/dashboard'
        },
    };
}
