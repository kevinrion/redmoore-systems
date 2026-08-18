import { Head, Link } from '@inertiajs/react';
import AlertList from '../../Components/AlertList';
import Sparkline from '../../Components/Sparkline';
import AppLayout from '../../Layouts/AppLayout';
import type { AlertSummary, DeviceSummary } from '../../types';

type Props = {
    device: DeviceSummary;
    alerts: AlertSummary[];
};

export default function OperationsDevice({ device, alerts }: Props) {
    return (
        <AppLayout>
            <Head title={device.name} />
            <div className="mx-auto max-w-6xl px-6 py-12">
                {device.site ? (
                    <Link href={`/operations/sites/${device.site.slug}`} className="text-sm text-crimson hover:underline">
                        {device.site.town}
                    </Link>
                ) : null}
                <h1 className="mt-2 text-3xl font-bold text-ink">{device.name}</h1>
                <p className="mt-2 text-ink/70">
                    Last 7 days of {device.metric_label.toLowerCase()} readings
                    {device.latest_reading
                        ? ` · now ${device.latest_reading.value.toFixed(1)}${device.unit}`
                        : ''}
                </p>

                <div className="mt-8 border border-ink/10 bg-white p-4">
                    <Sparkline points={device.readings ?? []} />
                </div>

                <h2 className="mt-12 text-xl font-bold text-ink">Alerts</h2>
                <div className="mt-4">
                    <AlertList alerts={alerts} />
                </div>
            </div>
        </AppLayout>
    );
}
