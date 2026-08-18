import { useEffect, useState } from 'react';
import type { AlertSummary } from '../types';

function formatWhen(value: string): string {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function xsrfToken(): string {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : '';
}

async function acknowledgeAlert(id: number): Promise<AlertSummary> {
    const response = await fetch(`/operations/alerts/${id}/acknowledge`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: '{}',
    });

    if (!response.ok) {
        throw new Error('Could not acknowledge alert');
    }

    return response.json();
}

function AlertRow({
    alert,
    onUpdated,
}: {
    alert: AlertSummary;
    onUpdated: (alert: AlertSummary) => void;
}) {
    const [processing, setProcessing] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (!alert.is_open) {
            return;
        }

        setProcessing(false);
        setShowSaved(false);
        setFading(false);
    }, [alert.is_open]);

    useEffect(() => {
        if (!showSaved) {
            return;
        }

        const fadeTimer = window.setTimeout(() => setFading(true), 2000);
        const hideTimer = window.setTimeout(() => setShowSaved(false), 2500);

        return () => {
            window.clearTimeout(fadeTimer);
            window.clearTimeout(hideTimer);
        };
    }, [showSaved]);

    return (
        <li className="grid grid-cols-1 items-center gap-3 rounded-sm border border-ink/10 bg-white px-4 py-4 shadow-sm sm:grid-cols-[auto_minmax(0,1fr)_9rem]">
            <span
                className={`w-fit rounded-sm px-2 py-0.5 text-xs font-bold tracking-wide uppercase ${
                    alert.is_open ? 'bg-crimson/10 text-crimson' : 'bg-clear-mist text-clear'
                }`}
            >
                {alert.is_open ? 'Open' : 'Cleared'}
            </span>
            <div className="min-w-0">
                <p className="font-medium text-ink">{alert.message}</p>
                <p className="mt-1 text-sm text-ink/55">
                    {alert.device?.site_town ? `${alert.device.site_town} · ` : ''}
                    {formatWhen(alert.triggered_at)}
                </p>
            </div>
            <div className="flex h-9 w-full items-center justify-end sm:w-[9rem]">
                {alert.is_open ? (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={() => {
                            setProcessing(true);
                            void acknowledgeAlert(alert.id)
                                .then((updated) => {
                                    setShowSaved(true);
                                    onUpdated(updated);
                                })
                                .catch(() => setProcessing(false));
                        }}
                        className="rounded-sm bg-crimson px-3 py-1.5 text-sm font-bold text-white hover:bg-crimson-dark disabled:opacity-60"
                    >
                        {processing ? 'Saving…' : 'Acknowledge'}
                    </button>
                ) : showSaved ? (
                    <span
                        className={`text-sm text-ink/45 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
                    >
                        Saved
                    </span>
                ) : (
                    <span className="invisible rounded-sm px-3 py-1.5 text-sm font-bold">Acknowledge</span>
                )}
            </div>
        </li>
    );
}

export default function AlertList({
    alerts,
    onAcknowledged,
}: {
    alerts: AlertSummary[];
    onAcknowledged?: (alert: AlertSummary) => void;
}) {
    const [items, setItems] = useState(alerts);

    useEffect(() => {
        setItems(alerts);
    }, [alerts]);

    if (items.length === 0) {
        return (
            <p className="border border-dashed border-ink/15 bg-white px-4 py-8 text-center text-sm text-ink/55">
                No alerts in this view.
            </p>
        );
    }

    return (
        <ul className="flex flex-col gap-3">
            {items.map((alert) => (
                <AlertRow
                    key={alert.id}
                    alert={alert}
                    onUpdated={(updated) => {
                        setItems((current) =>
                            current.map((item) =>
                                item.id === updated.id
                                    ? { ...item, ...updated, device: updated.device ?? item.device }
                                    : item,
                            ),
                        );
                        onAcknowledged?.(updated);
                    }}
                />
            ))}
        </ul>
    );
}
