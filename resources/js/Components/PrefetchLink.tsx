import { useQueryClient } from '@tanstack/react-query';
import type { ComponentProps, MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { prefetchOperationsRoute } from '../api/operations';

type PrefetchLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & {
    to: string;
};

export default function PrefetchLink({ to, onClick, ...props }: PrefetchLinkProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const prefetch = () => {
        void prefetchOperationsRoute(queryClient, to);
    };

    const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
            return;
        }

        event.preventDefault();
        await prefetchOperationsRoute(queryClient, to);
        navigate(to);
    };

    return <Link to={to} onMouseEnter={prefetch} onFocus={prefetch} onClick={handleClick} {...props} />;
}
