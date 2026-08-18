import { Head, Link } from '@inertiajs/react';
import AlertList from '../../Components/AlertList';
import AppLayout from '../../Layouts/AppLayout';
import type { AlertSummary, SiteSummary } from '../../types';

type Props = {
    sites: SiteSummary[];
    alerts: AlertSummary[];
};

function readingLabel(site: SiteSummary, metric: string): string {
    const device = site.devices?.find((item) => item.metric === metric);
    if (!device?.latest_reading) {
        return '—';
    }

    return `${device.latest_reading.value.toFixed(1)}${device.unit}`;
}

export default function OperationsIndex({ sites, alerts }: Props) {
    return (
        <AppLayout>
            <Head title="Operations" />
            <div className="mx-auto max-w-6xl px-6 py-12">
                <h1 className="text-3xl font-bold text-ink">Operations</h1>
                <p className="mt-2 max-w-2xl text-ink/80">
                    Five UK sites. Each reports temperature, humidity, and how full the warehouse is. Acknowledge an
                    alert to save that on the server.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {sites.map((site) => (
                        <Link
                            key={site.slug}
                            href={`/operations/sites/${site.slug}`}
                            className="border border-ink/10 bg-white p-5 hover:border-crimson"
                        >
                            <p className="text-sm text-gold">{site.town}</p>
                            <h2 className="mt-1 text-xl font-bold text-ink">{site.name}</h2>
                            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                                <div>
                                    <dt className="text-ink/60">Temp</dt>
                                    <dd className="font-bold">{readingLabel(site, 'temperature')}</dd>
                                </div>
                                <div>
                                    <dt className="text-ink/60">Humidity</dt>
                                    <dd className="font-bold">{readingLabel(site, 'humidity')}</dd>
                                </div>
                                <div>
                                    <dt className="text-ink/60">Fill</dt>
                                    <dd className="font-bold">{readingLabel(site, 'fill')}</dd>
                                </div>
                            </dl>
                        </Link>
                    ))}
                </div>

                <h2 className="mt-12 text-xl font-bold text-ink">Alerts</h2>
                <div className="mt-4">
                    <AlertList alerts={alerts} />
                </div>
            </div>
        </AppLayout>
    );
}
