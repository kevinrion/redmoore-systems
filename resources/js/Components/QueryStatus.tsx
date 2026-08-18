import type { ReactNode } from 'react';
import PageSkeleton from './PageSkeleton';

export default function QueryStatus({
    isLoading,
    isError,
    children,
}: {
    isLoading: boolean;
    isError: boolean;
    children: ReactNode;
}) {
    if (isLoading) {
        return <PageSkeleton />;
    }

    if (isError) {
        return (
            <p className="mx-auto min-h-[70vh] max-w-6xl px-6 py-16 text-center text-sm text-crimson">
                Could not load this view.
            </p>
        );
    }

    return children;
}
