import { cn } from '@/lib/utils';

type AnimatedCheckProps = {
    className?: string;
};

export function AnimatedCheck({ className }: AnimatedCheckProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                'animated-check mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50',
                className,
            )}
        >
            <svg
                viewBox="0 0 48 48"
                fill="none"
                className="h-9 w-9 text-emerald-600"
            >
                <circle
                    className="animated-check-ring"
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                />
                <path
                    className="animated-check-mark"
                    d="M16.5 24.5 21.5 29.5 31.5 18.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}
