import { router } from '@inertiajs/react';
import type { AlertSummary } from '../types';

function formatWhen(value: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function AlertList({ alerts }: { alerts: AlertSummary[] }) {
    if (alerts.length === 0) {
        return <p className="text-sm text-ink/60">No alerts in this view.</p>;
    }

    return (
        <ul className="divide-y divide-ink/10 border border-ink/10 bg-white">
            {alerts.map((alert) => (
                <li key={alert.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-medium text-ink">{alert.message}</p>
                        <p className="mt-1 text-sm text-ink/60">
                            {alert.device?.site_town ? `${alert.device.site_town} · ` : ''}
                            {formatWhen(alert.triggered_at)}
                            {alert.is_open ? '' : ' · acknowledged'}
                        </p>
                    </div>
                    {alert.is_open ? (
                        <button
                            type="button"
                            onClick={() => router.post(`/operations/alerts/${alert.id}/acknowledge`)}
                            className="shrink-0 rounded-sm border border-crimson px-3 py-1.5 text-sm font-bold text-crimson hover:bg-crimson hover:text-white"
                        >
                            Acknowledge
                        </button>
                    ) : (
                        <span className="text-sm text-ink/50">Done</span>
                    )}
                </li>
            ))}
        </ul>
    );
}
