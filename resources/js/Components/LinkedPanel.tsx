import type { PropsWithChildren } from 'react';
import PrefetchLink from './PrefetchLink';

export default function LinkedPanel({ href, children }: PropsWithChildren<{ href: string }>) {
    return (
        <PrefetchLink to={href} className="block rounded-sm border-2 border-crimson bg-white p-5 hover:border-crimson-mist">
            {children}
        </PrefetchLink>
    );
}
