import { Head, Link } from '@inertiajs/react';
import AlertList from '../../Components/AlertList';
import AppLayout from '../../Layouts/AppLayout';
import type { AlertSummary, SiteSummary } from '../../types';

type Props = {
    site: SiteSummary;
    alerts: AlertSummary[];
};

export default function OperationsSite({ site, alerts }: Props) {
    return (
        <AppLayout>
            <Head title={site.name} />
            <div className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-sm text-gold">{site.town}</p>
                <h1 className="mt-1 text-3xl font-bold text-ink">{site.name}</h1>

                <ul className="mt-8 grid gap-4 md:grid-cols-3">
                    {site.devices?.map((device) => (
                        <li key={device.id}>
                            <Link
                                href={`/operations/devices/${device.id}`}
                                className="block border border-ink/10 bg-white p-5 hover:border-crimson"
                            >
                                <p className="text-sm text-ink/60">{device.metric_label}</p>
                                <p className="mt-2 text-2xl font-bold text-ink">
                                    {device.latest_reading
                                        ? `${device.latest_reading.value.toFixed(1)}${device.unit}`
                                        : '—'}
                                </p>
                                <p className="mt-2 text-sm text-crimson">View chart</p>
                            </Link>
                        </li>
                    ))}
                </ul>

                <h2 className="mt-12 text-xl font-bold text-ink">Alerts</h2>
                <div className="mt-4">
                    <AlertList alerts={alerts} />
                </div>
            </div>
        </AppLayout>
    );
}
