import { Eye, EyeOff, Loader2, Lock, Mail, Package } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginForm } from '@/hooks/use-login-form';
import { cn } from '@/lib/utils';

export type LoginFormProps = {
    systemName?: string;
    forgotPasswordHref?: string;
    className?: string;
};

export function LoginForm({
    systemName = 'Inventory Management System',
    forgotPasswordHref,
    className,
}: LoginFormProps) {
    const {
        form,
        showPassword,
        setShowPassword,
        serverError,
        isSubmitting,
        onSubmit,
    } = useLoginForm();

    return (
        <Card className={cn('w-full max-w-md border-border/80 shadow-md', className)}>
            <CardHeader className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <Package className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                    <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {systemName}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                        Manage your inventory efficiently and securely
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        {serverError ? (
                            <Alert variant="destructive">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        ) : null}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail
                                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                            <Input
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@company.com"
                                                className="pl-9"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock
                                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                aria-hidden="true"
                                            />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                placeholder="Enter your password"
                                                className="px-9"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:bg-transparent hover:text-foreground"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                disabled={isSubmitting}
                                                aria-label={
                                                    showPassword ? 'Hide password' : 'Show password'
                                                }
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between gap-3">
                            <FormField
                                control={form.control}
                                name="remember"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(checked) =>
                                                    field.onChange(checked === true)
                                                }
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormLabel className="cursor-pointer font-normal">
                                            Remember me
                                        </FormLabel>
                                    </FormItem>
                                )}
                            />

                            {forgotPasswordHref ? (
                                <a
                                    href={forgotPasswordHref}
                                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            ) : null}
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
