import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import DemoControls from '../Components/DemoControls';

export default function AppLayout({ children }: PropsWithChildren) {
    const { url } = usePage();
    const onOperations = url.startsWith('/operations');

    return (
        <div className="flex min-h-screen flex-col bg-paper">
            <header className="sticky top-0 z-10 border-b border-ink/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/brand/logo.svg" alt="" className="h-8 w-8" />
                        <span className="text-sm font-bold tracking-wide text-crimson">Redmoore Systems</span>
                    </Link>
                    <nav className="flex items-center gap-1 text-sm">
                        <Link
                            href="/"
                            className={`rounded-sm px-3 py-1.5 ${url === '/' ? 'bg-paper font-bold text-crimson' : 'text-ink/70 hover:text-crimson'}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/operations"
                            className={`rounded-sm px-3 py-1.5 ${onOperations ? 'bg-paper font-bold text-crimson' : 'text-ink/70 hover:text-crimson'}`}
                        >
                            Operations
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-ink/10 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-y-2 px-6 py-4 text-sm">
                    <p className="text-ink/55">Fictional company. Portfolio demo — not a live product.</p>
                    <span className="mx-4 text-ink/25" aria-hidden="true">
                        |
                    </span>
                    <DemoControls />
                </div>
            </footer>
        </div>
    );
}
