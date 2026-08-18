import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AlertList from '../../Components/AlertList';
import LinkedPanel from '../../Components/LinkedPanel';
import PageHeader from '../../Components/PageHeader';
import AppLayout from '../../Layouts/AppLayout';
import { formatReading, isOutOfRange } from '../../metrics';
import type { AlertSummary, SiteSummary } from '../../types';

type Props = {
    site: SiteSummary;
    alerts: AlertSummary[];
};

export default function OperationsSite({ site, alerts }: Props) {
    const [openCount, setOpenCount] = useState(site.open_alert_count ?? 0);

    useEffect(() => {
        setOpenCount(site.open_alert_count ?? 0);
    }, [site.open_alert_count]);

    return (
        <AppLayout>
            <Head title={site.name} />
            <div className="mx-auto max-w-6xl px-6 py-10">
                <PageHeader
                    crumbs={[
                        { label: 'Operations', href: '/operations' },
                        { label: site.town },
                    ]}
                    title={site.name}
                    description={`${site.town} cold store. Open a metric to see the last seven days.`}
                    aside={
                        openCount > 0 ? (
                            <p className="text-sm font-bold text-crimson">{openCount} open alerts</p>
                        ) : null
                    }
                />

                <ul className="grid gap-4 md:grid-cols-3">
                    {site.devices?.map((device) => {
                        const value = device.latest_reading?.value;
                        const warn = value !== undefined && isOutOfRange(device.metric, value);

                        return (
                            <li key={device.id}>
                                <LinkedPanel href={`/operations/devices/${device.id}`}>
                                    <p className="text-sm text-ink/50">{device.metric_label}</p>
                                    <p className={`mt-2 text-3xl font-bold ${warn ? 'text-crimson' : 'text-ink'}`}>
                                        {device.latest_reading
                                            ? formatReading(device.latest_reading.value, device.unit)
                                            : '—'}
                                    </p>
                                    <p className="mt-3 text-sm font-bold text-crimson">View trend</p>
                                </LinkedPanel>
                            </li>
                        );
                    })}
                </ul>

                <h2 className="mt-12 text-lg font-bold text-ink">Alerts</h2>
                <div className="mt-3">
                    <AlertList
                        alerts={alerts}
                        onAcknowledged={() => setOpenCount((count) => Math.max(0, count - 1))}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
