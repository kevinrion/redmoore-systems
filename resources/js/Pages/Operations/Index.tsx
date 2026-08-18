import AlertList from '../../Components/AlertList';
import LinkedPanel from '../../Components/LinkedPanel';
import PageHeader from '../../Components/PageHeader';
import QueryStatus from '../../Components/QueryStatus';
import { useRecentAlerts, useSites } from '../../api/operations';
import { useDocumentTitle } from '../../lib/documentTitle';
import { formatReading, isOutOfRange } from '../../metrics';
import type { SiteSummary } from '../../types';

function MetricCell({ site, metric, label }: { site: SiteSummary; metric: string; label: string }) {
    const device = site.devices?.find((item) => item.metric === metric);
    const value = device?.latest_reading?.value;
    const warn = value !== undefined && isOutOfRange(metric, value);

    return (
        <div>
            <dt className="text-ink/50">{label}</dt>
            <dd className={`mt-0.5 font-bold ${warn ? 'text-crimson' : 'text-ink'}`}>
                {device?.latest_reading && device.unit ? formatReading(device.latest_reading.value, device.unit) : '—'}
            </dd>
        </div>
    );
}

export default function OperationsIndex() {
    useDocumentTitle('Operations');

    const sitesQuery = useSites();
    const alertsQuery = useRecentAlerts();
    const sites = sitesQuery.data ?? [];
    const alerts = alertsQuery.data ?? [];
    const openInList = alerts.filter((alert) => alert.is_open).length;
    const isLoading =
        (sitesQuery.isPending && !sitesQuery.data) || (alertsQuery.isPending && !alertsQuery.data);

    return (
        <QueryStatus isLoading={isLoading} isError={sitesQuery.isError || alertsQuery.isError}>
            <div className="mx-auto max-w-6xl px-6 py-10">
                <PageHeader
                    title="Operations"
                    description="Five UK sites. Temperature, humidity, and fill level. Acknowledging an alert writes to the database."
                    aside={
                        <p className="rounded-sm bg-white px-3 py-2 text-sm text-ink/70 ring-1 ring-ink/10">
                            <span className="font-bold text-crimson">{openInList}</span> open in this list
                        </p>
                    }
                />

                <div className="grid gap-4 md:grid-cols-2">
                    {sites.map((site) => (
                        <LinkedPanel key={site.slug} href={`/operations/sites/${site.slug}`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-gold uppercase">{site.town}</p>
                                    <h2 className="mt-1 text-xl font-bold text-ink">{site.name}</h2>
                                </div>
                                {(site.open_alert_count ?? 0) > 0 ? (
                                    <span className="rounded-sm bg-crimson/10 px-2 py-0.5 text-xs font-bold text-crimson">
                                        {site.open_alert_count} open
                                    </span>
                                ) : (
                                    <span className="text-xs text-ink/40">Clear</span>
                                )}
                            </div>
                            <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                                <MetricCell site={site} metric="temperature" label="Temp" />
                                <MetricCell site={site} metric="humidity" label="Humidity" />
                                <MetricCell site={site} metric="fill" label="Fill" />
                            </dl>
                        </LinkedPanel>
                    ))}
                </div>

                <h2 className="mt-12 text-lg font-bold text-ink">Recent alerts</h2>
                <div className="mt-3">
                    <AlertList alerts={alerts} />
                </div>
            </div>
        </QueryStatus>
    );
}
