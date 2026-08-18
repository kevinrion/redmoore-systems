import type { ReactNode } from 'react';

export default function QueryStatus({
    isPending,
    isError,
    children,
}: {
    isPending: boolean;
    isError: boolean;
    children: ReactNode;
}) {
    if (isPending) {
        return <p className="px-6 py-16 text-center text-sm text-ink/55">Loading…</p>;
    }

    if (isError) {
        return <p className="px-6 py-16 text-center text-sm text-crimson">Could not load this view.</p>;
    }

    return children;
}
