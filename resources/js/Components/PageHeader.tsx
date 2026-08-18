import type { ReactNode } from 'react';
import PrefetchLink from './PrefetchLink';

type Crumb = {
    label: string;
    href?: string;
};

export default function PageHeader({
    crumbs,
    title,
    description,
    aside,
}: {
    crumbs?: Crumb[];
    title: string;
    description?: string;
    aside?: ReactNode;
}) {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {crumbs && crumbs.length > 0 ? (
                    <nav className="mb-2 flex flex-wrap items-center gap-2 text-sm text-ink/55">
                        {crumbs.map((crumb, index) => (
                            <span key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                                {index > 0 ? <span aria-hidden="true">/</span> : null}
                                {crumb.href ? (
                                    <PrefetchLink to={crumb.href} className="hover:text-crimson">
                                        {crumb.label}
                                    </PrefetchLink>
                                ) : (
                                    <span className="text-ink/80">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                ) : null}
                <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
                {description ? <p className="mt-2 max-w-2xl text-ink/70">{description}</p> : null}
            </div>
            {aside}
        </div>
    );
}
