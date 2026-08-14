import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreatedUserCredentials } from '@/types/user';

type CreatedUserCredentialsDialogProps = {
    credentials: CreatedUserCredentials | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type CopyTarget = 'email' | 'username' | 'password' | 'all';

async function copyText(value: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        return false;
    }
}

function CopyField({
    id,
    label,
    value,
    copied,
    onCopy,
}: {
    id: string;
    label: string;
    value: string;
    copied: boolean;
    onCopy: () => void;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex gap-2">
                <Input id={id} readOnly value={value} className="font-mono text-sm" />
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCopy}
                    aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
                >
                    {copied ? (
                        <Check aria-hidden="true" />
                    ) : (
                        <Copy aria-hidden="true" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                </Button>
            </div>
        </div>
    );
}

export function CreatedUserCredentialsDialog({
    credentials,
    open,
    onOpenChange,
}: CreatedUserCredentialsDialogProps) {
    const [copied, setCopied] = useState<CopyTarget | null>(null);

    const handleCopy = async (target: CopyTarget, value: string) => {
        const copiedSuccessfully = await copyText(value);

        if (!copiedSuccessfully) {
            return;
        }

        setCopied(target);
        window.setTimeout(() => setCopied(null), 2000);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    setCopied(null);
                }
                onOpenChange(nextOpen);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>User created</DialogTitle>
                    <DialogDescription>
                        Copy these sign-in details now. The password is shown only
                        once.
                    </DialogDescription>
                </DialogHeader>

                {credentials ? (
                    <div className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                Share these credentials securely. The password is
                                not stored in plain text and cannot be viewed again.
                            </AlertDescription>
                        </Alert>

                        <CopyField
                            id="created-user-email"
                            label="Email"
                            value={credentials.email}
                            copied={copied === 'email'}
                            onCopy={() =>
                                void handleCopy('email', credentials.email)
                            }
                        />
                        <CopyField
                            id="created-user-username"
                            label="Username"
                            value={credentials.username}
                            copied={copied === 'username'}
                            onCopy={() =>
                                void handleCopy('username', credentials.username)
                            }
                        />
                        <CopyField
                            id="created-user-password"
                            label="Password"
                            value={credentials.password}
                            copied={copied === 'password'}
                            onCopy={() =>
                                void handleCopy('password', credentials.password)
                            }
                        />
                    </div>
                ) : null}

                <DialogFooter className="sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={!credentials}
                        onClick={() => {
                            if (!credentials) {
                                return;
                            }

                            void handleCopy(
                                'all',
                                `Email: ${credentials.email}\nUsername: ${credentials.username}\nPassword: ${credentials.password}`,
                            );
                        }}
                    >
                        {copied === 'all' ? (
                            <Check aria-hidden="true" />
                        ) : (
                            <Copy aria-hidden="true" />
                        )}
                        {copied === 'all' ? 'Copied all' : 'Copy all'}
                    </Button>
                    <Button type="button" onClick={() => onOpenChange(false)}>
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
