import { useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usersUrl } from '@/lib/navigation/urls';
import { cn } from '@/lib/utils';
import type { UserFormValues, UserRoleOption } from '@/types/user';

type AddUserModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: UserRoleOption[];
};

const initialValues = (roles: UserRoleOption[]): UserFormValues => ({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    role: roles.find((role) => role.label === 'Staff')?.value ?? roles[0]?.value ?? '',
    is_active: true,
});

export function AddUserModal({ open, onOpenChange, roles }: AddUserModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<UserFormValues>(initialValues(roles));

    const closeAndReset = () => {
        reset();
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    reset();
                    clearErrors();
                }
                onOpenChange(nextOpen);
            }}
        >
            <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add user</DialogTitle>
                    <DialogDescription>
                        Create an account and assign a role. A temporary password
                        will be generated for you to copy after the user is created.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        post(usersUrl(), {
                            preserveScroll: true,
                            onSuccess: () => closeAndReset(),
                        });
                    }}
                    className="space-y-5"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="First name"
                            required
                            htmlFor="user-first-name"
                            error={errors.first_name}
                        >
                            <Input
                                id="user-first-name"
                                value={data.first_name}
                                onChange={(event) =>
                                    setData('first_name', event.target.value)
                                }
                                autoComplete="given-name"
                            />
                        </Field>
                        <Field
                            label="Last name"
                            required
                            htmlFor="user-last-name"
                            error={errors.last_name}
                        >
                            <Input
                                id="user-last-name"
                                value={data.last_name}
                                onChange={(event) =>
                                    setData('last_name', event.target.value)
                                }
                                autoComplete="family-name"
                            />
                        </Field>
                    </div>

                    <Field
                        label="Username"
                        required
                        htmlFor="user-username"
                        error={errors.username}
                    >
                        <Input
                            id="user-username"
                            value={data.username}
                            onChange={(event) =>
                                setData('username', event.target.value)
                            }
                            autoComplete="username"
                        />
                    </Field>

                    <Field
                        label="Email"
                        required
                        hint="Used to sign in"
                        htmlFor="user-email"
                        error={errors.email}
                    >
                        <Input
                            id="user-email"
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            autoComplete="email"
                        />
                    </Field>

                    <Field
                        label="Phone number"
                        htmlFor="user-phone"
                        error={errors.phone_number}
                    >
                        <Input
                            id="user-phone"
                            value={data.phone_number}
                            onChange={(event) =>
                                setData('phone_number', event.target.value)
                            }
                            autoComplete="tel"
                        />
                    </Field>

                    <div>
                        <p className="mb-2 text-sm font-medium text-slate-700">
                            Role
                            <span className="ml-1 text-destructive">*</span>
                        </p>
                        <RadioGroup
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                            className="grid gap-2"
                            aria-label="Role"
                        >
                            {roles.map((role) => {
                                const inputId = `user-role-${role.value.replace(/\s+/g, '-').toLowerCase()}`;

                                return (
                                    <Label
                                        key={role.value}
                                        htmlFor={inputId}
                                        className={cn(
                                            'flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 font-normal',
                                            data.role === role.value &&
                                                'border-slate-900 bg-slate-50',
                                        )}
                                    >
                                        <RadioGroupItem
                                            value={role.value}
                                            id={inputId}
                                            aria-invalid={Boolean(errors.role)}
                                        />
                                        <span className="text-sm text-slate-900">
                                            {role.label}
                                        </span>
                                    </Label>
                                );
                            })}
                        </RadioGroup>
                        {errors.role ? (
                            <p className="mt-1 text-xs font-normal text-destructive">
                                {errors.role}
                            </p>
                        ) : null}
                    </div>

                    <div className="flex items-start gap-3">
                        <input
                            id="user-is-active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(event) =>
                                setData('is_active', event.target.checked)
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <div>
                            <label
                                htmlFor="user-is-active"
                                className="text-sm font-medium text-slate-900"
                            >
                                User is active
                            </label>
                            <p className="mt-1 text-sm text-slate-500">
                                Inactive users cannot sign in.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeAndReset}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <UserPlus aria-hidden="true" />
                            {processing ? 'Creating...' : 'Create user'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
