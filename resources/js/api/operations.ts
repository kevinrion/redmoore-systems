import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getJson, postJson } from './http';
import type { AlertSummary, DeviceSummary, SiteSummary } from '../types';

const fetchSites = () => getJson<SiteSummary[]>('/api/sites');
const fetchSite = (slug: string) => getJson<SiteSummary>(`/api/sites/${slug}`);
const fetchDevice = (id: number) => getJson<DeviceSummary>(`/api/devices/${id}`);
const fetchRecentAlerts = () => getJson<AlertSummary[]>('/api/alerts');
const fetchSiteAlerts = (slug: string) =>
    getJson<AlertSummary[]>(`/api/alerts?site=${encodeURIComponent(slug)}`);
const fetchDeviceAlerts = (id: number) => getJson<AlertSummary[]>(`/api/alerts?device=${id}`);

export const queryKeys = {
    sites: {
        all: ['sites'] as const,
        list: () => [...queryKeys.sites.all, 'list'] as const,
        detail: (slug: string) => [...queryKeys.sites.all, 'detail', slug] as const,
    },
    devices: {
        all: ['devices'] as const,
        detail: (id: number) => [...queryKeys.devices.all, 'detail', id] as const,
    },
    alerts: {
        all: ['alerts'] as const,
        recent: () => [...queryKeys.alerts.all, 'recent'] as const,
        site: (slug: string) => [...queryKeys.alerts.all, 'site', slug] as const,
        device: (id: number) => [...queryKeys.alerts.all, 'device', id] as const,
    },
};

export function useSites() {
    return useQuery({
        queryKey: queryKeys.sites.list(),
        queryFn: fetchSites,
    });
}

export function useSite(slug: string) {
    return useQuery({
        queryKey: queryKeys.sites.detail(slug),
        queryFn: () => fetchSite(slug),
        enabled: slug.length > 0,
    });
}

export function useDevice(id: number) {
    return useQuery({
        queryKey: queryKeys.devices.detail(id),
        queryFn: () => fetchDevice(id),
        enabled: Number.isFinite(id) && id > 0,
    });
}

export function useRecentAlerts() {
    return useQuery({
        queryKey: queryKeys.alerts.recent(),
        queryFn: fetchRecentAlerts,
    });
}

export function useSiteAlerts(slug: string) {
    return useQuery({
        queryKey: queryKeys.alerts.site(slug),
        queryFn: () => fetchSiteAlerts(slug),
        enabled: slug.length > 0,
    });
}

export function useDeviceAlerts(id: number) {
    return useQuery({
        queryKey: queryKeys.alerts.device(id),
        queryFn: () => fetchDeviceAlerts(id),
        enabled: Number.isFinite(id) && id > 0,
    });
}

export async function prefetchOperationsRoute(queryClient: QueryClient, path: string): Promise<void> {
    const siteMatch = path.match(/^\/operations\/sites\/([^/]+)$/);

    if (siteMatch) {
        const slug = decodeURIComponent(siteMatch[1]);

        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: queryKeys.sites.detail(slug),
                queryFn: () => fetchSite(slug),
            }),
            queryClient.prefetchQuery({
                queryKey: queryKeys.alerts.site(slug),
                queryFn: () => fetchSiteAlerts(slug),
            }),
        ]);

        return;
    }

    const deviceMatch = path.match(/^\/operations\/devices\/(\d+)$/);

    if (deviceMatch) {
        const id = Number(deviceMatch[1]);

        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: queryKeys.devices.detail(id),
                queryFn: () => fetchDevice(id),
            }),
            queryClient.prefetchQuery({
                queryKey: queryKeys.alerts.device(id),
                queryFn: () => fetchDeviceAlerts(id),
            }),
        ]);

        return;
    }

    if (path === '/operations') {
        await Promise.all([
            queryClient.prefetchQuery({
                queryKey: queryKeys.sites.list(),
                queryFn: fetchSites,
            }),
            queryClient.prefetchQuery({
                queryKey: queryKeys.alerts.recent(),
                queryFn: fetchRecentAlerts,
            }),
        ]);
    }
}

function replaceAlert(alerts: AlertSummary[] | undefined, updated: AlertSummary): AlertSummary[] | undefined {
    if (!alerts) {
        return alerts;
    }

    return alerts.map((alert) =>
        alert.id === updated.id ? { ...alert, ...updated, device: updated.device ?? alert.device } : alert,
    );
}

export function useAcknowledgeAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => postJson<AlertSummary>(`/api/alerts/${id}/acknowledge`),
        onSuccess: (updated) => {
            queryClient.setQueriesData<AlertSummary[]>({ queryKey: queryKeys.alerts.all }, (current) =>
                replaceAlert(current, updated),
            );
            void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
        },
    });
}

export function useResetAcknowledgements() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => postJson<void>('/api/demo/reset-acknowledgements'),
        onSuccess: () => {
            queryClient.setQueriesData<AlertSummary[]>({ queryKey: queryKeys.alerts.all }, (current) =>
                current?.map((alert) => ({ ...alert, acknowledged_at: null, is_open: true })),
            );
            void queryClient.invalidateQueries({ queryKey: queryKeys.sites.all });
        },
    });
}
