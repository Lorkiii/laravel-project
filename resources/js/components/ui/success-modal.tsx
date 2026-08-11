import { Button } from '@/components/ui/button';
import { AnimatedCheck } from '@/components/ui/animated-check';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export type SuccessModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    actionLabel?: string;
};

export function SuccessModal({
    open,
    onOpenChange,
    title,
    description,
    actionLabel = 'Done',
}: SuccessModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <div className="pt-1">
                    <AnimatedCheck />
                </div>
                <DialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button type="button" onClick={() => onOpenChange(false)}>
                        {actionLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
