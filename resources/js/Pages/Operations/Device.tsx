import { Head } from '@inertiajs/react';
import AlertList from '../../Components/AlertList';
import PageHeader from '../../Components/PageHeader';
import Sparkline from '../../Components/Sparkline';
import AppLayout from '../../Layouts/AppLayout';
import { formatReading, isOutOfRange } from '../../metrics';
import type { AlertSummary, DeviceSummary } from '../../types';

type Props = {
    device: DeviceSummary;
    alerts: AlertSummary[];
};

export default function OperationsDevice({ device, alerts }: Props) {
    const current = device.latest_reading?.value;
    const warn = current !== undefined && isOutOfRange(device.metric, current);

    return (
        <AppLayout>
            <Head title={device.name} />
            <div className="mx-auto max-w-6xl px-6 py-10">
                <PageHeader
                    crumbs={[
                        { label: 'Operations', href: '/operations' },
                        {
                            label: device.site?.town ?? 'Site',
                            href: device.site ? `/operations/sites/${device.site.slug}` : undefined,
                        },
                        { label: device.metric_label },
                    ]}
                    title={device.name}
                    description={`Last 7 days of ${device.metric_label.toLowerCase()} readings.`}
                    aside={
                        device.latest_reading ? (
                            <p className={`text-3xl font-bold ${warn ? 'text-crimson' : 'text-ink'}`}>
                                {formatReading(device.latest_reading.value, device.unit)}
                            </p>
                        ) : null
                    }
                />

                <div className="rounded-sm border border-ink/10 bg-white p-5 shadow-sm">
                    <Sparkline points={device.readings ?? []} unit={device.unit} />
                </div>

                <h2 className="mt-12 text-lg font-bold text-ink">Alerts</h2>
                <div className="mt-3">
                    <AlertList alerts={alerts} />
                </div>
            </div>
        </AppLayout>
    );
}
