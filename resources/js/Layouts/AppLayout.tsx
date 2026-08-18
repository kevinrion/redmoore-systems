import { Link, Outlet, useLocation } from 'react-router';
import DemoControls from '../Components/DemoControls';

export default function AppLayout() {
    const { pathname } = useLocation();
    const onOperations = pathname.startsWith('/operations');

    return (
        <>
            <header className="border-b border-ink/10 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/brand/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
                        <span className="text-sm font-bold tracking-wide text-crimson">Redmoore Systems</span>
                    </Link>
                    <nav className="flex items-center gap-1 text-sm">
                        <Link
                            to="/"
                            className={`rounded-sm px-3 py-1.5 ${pathname === '/' ? 'bg-paper font-bold text-crimson' : 'text-ink/70 hover:text-crimson'}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/operations"
                            className={`rounded-sm px-3 py-1.5 ${onOperations ? 'bg-paper font-bold text-crimson' : 'text-ink/70 hover:text-crimson'}`}
                        >
                            Operations
                        </Link>
                    </nav>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="border-t border-ink/10 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-y-2 px-6 py-4 text-sm">
                    <p className="text-ink/55">Fictional company. Portfolio demo — not a live product.</p>
                    <span className="mx-4 text-ink/25" aria-hidden="true">
                        |
                    </span>
                    <DemoControls />
                </div>
            </footer>
        </>
    );
}
