import { useForm } from '@inertiajs/react';
import type { AlertSummary } from '../types';

function formatWhen(value: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function AlertRow({ alert }: { alert: AlertSummary }) {
    const form = useForm({});

    return (
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`rounded-sm px-2 py-0.5 text-xs font-bold tracking-wide uppercase ${
                            alert.is_open ? 'bg-crimson/10 text-crimson' : 'bg-ink/10 text-ink/55'
                        }`}
                    >
                        {alert.is_open ? 'Open' : 'Cleared'}
                    </span>
                    <p className="font-medium text-ink">{alert.message}</p>
                </div>
                <p className="mt-1 text-sm text-ink/55">
                    {alert.device?.site_town ? `${alert.device.site_town} · ` : ''}
                    {formatWhen(alert.triggered_at)}
                </p>
            </div>
            {alert.is_open ? (
                <button
                    type="button"
                    disabled={form.processing}
                    onClick={() => form.post(`/operations/alerts/${alert.id}/acknowledge`)}
                    className="shrink-0 rounded-sm bg-crimson px-3 py-1.5 text-sm font-bold text-white hover:bg-crimson-dark disabled:opacity-60"
                >
                    {form.processing ? 'Saving…' : 'Acknowledge'}
                </button>
            ) : (
                <span className="shrink-0 text-sm text-ink/45">Saved</span>
            )}
        </li>
    );
}

export default function AlertList({ alerts }: { alerts: AlertSummary[] }) {
    if (alerts.length === 0) {
        return (
            <p className="border border-dashed border-ink/15 bg-white px-4 py-8 text-center text-sm text-ink/55">
                No alerts in this view.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-sm border border-ink/10 bg-white">
            {alerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
            ))}
        </ul>
    );
}
