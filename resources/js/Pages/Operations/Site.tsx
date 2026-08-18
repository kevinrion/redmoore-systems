import { useParams } from 'react-router';
import AlertList from '../../Components/AlertList';
import LinkedPanel from '../../Components/LinkedPanel';
import PageHeader from '../../Components/PageHeader';
import QueryStatus from '../../Components/QueryStatus';
import { useSite, useSiteAlerts } from '../../api/operations';
import { useDocumentTitle } from '../../lib/documentTitle';
import { formatReading, isOutOfRange } from '../../metrics';

export default function OperationsSite() {
    const { slug = '' } = useParams();
    const siteQuery = useSite(slug);
    const alertsQuery = useSiteAlerts(slug);
    const site = siteQuery.data;
    const alerts = alertsQuery.data ?? [];

    useDocumentTitle(site?.name);

    return (
        <QueryStatus isPending={siteQuery.isPending || alertsQuery.isPending} isError={siteQuery.isError || alertsQuery.isError}>
            {site ? (
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <PageHeader
                        crumbs={[
                            { label: 'Operations', href: '/operations' },
                            { label: site.town },
                        ]}
                        title={site.name}
                        description={`${site.town} cold store. Open a metric to see the last seven days.`}
                        aside={
                            (site.open_alert_count ?? 0) > 0 ? (
                                <p className="text-sm font-bold text-crimson">{site.open_alert_count} open alerts</p>
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
                        <AlertList alerts={alerts} />
                    </div>
                </div>
            ) : null}
        </QueryStatus>
    );
}
