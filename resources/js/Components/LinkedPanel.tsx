import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function LinkedPanel({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <Link
            href={href}
            className="group relative block overflow-hidden rounded-sm border-2 border-crimson bg-white p-5 shadow-sm transition-colors hover:border-crimson-mist"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 h-4 w-4 bg-crimson opacity-0 transition-opacity duration-150 group-hover:opacity-100 [clip-path:polygon(0_0,100%_0,0_100%)]"
            />
            {children}
        </Link>
    );
}
