import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type AppLayoutProps = PropsWithChildren<{
    title?: string;
}>;

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b border-ink/10 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/brand/logo.svg" alt="Redmoore Systems" className="h-9 w-9" />
                        <span className="text-sm font-bold tracking-wide text-crimson">Redmoore Systems</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        <Link href="/" className="text-ink/80 hover:text-crimson">
                            Home
                        </Link>
                        <Link href="/operations" className="text-ink/80 hover:text-crimson">
                            Operations
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-ink/10 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-ink/60">
                    Fictional company. Portfolio demo — not a live product.
                </div>
            </footer>
        </div>
    );
}
