import { useAuth } from '@/hooks/use-auth';

export function WelcomeFooter() {
    const { app } = useAuth();
    const year = new Date().getFullYear();

    return (
        <footer className="relative z-10 border-t border-slate-300/80 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 text-sm text-slate-500 sm:px-8">
                <span>
                    &copy; {year} {app.name}
                </span>
                <span className="hidden text-slate-400 sm:inline">
                    Secure inventory control for your business
                </span>
            </div>
        </footer>
    );
}
