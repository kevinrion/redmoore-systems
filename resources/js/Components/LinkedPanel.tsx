import { Link } from 'react-router';
import type { PropsWithChildren } from 'react';

export default function LinkedPanel({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <Link to={href} className="block rounded-sm border-2 border-crimson bg-white p-5 hover:border-crimson-mist">
            {children}
        </Link>
    );
}
