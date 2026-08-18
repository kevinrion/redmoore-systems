import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getJson, postJson } from './http';
import type { AlertSummary, DeviceSummary, SiteSummary } from '../types';

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
        queryFn: () => getJson<SiteSummary[]>('/api/sites'),
    });
}

export function useSite(slug: string) {
    return useQuery({
        queryKey: queryKeys.sites.detail(slug),
        queryFn: () => getJson<SiteSummary>(`/api/sites/${slug}`),
        enabled: slug.length > 0,
    });
}

export function useDevice(id: number) {
    return useQuery({
        queryKey: queryKeys.devices.detail(id),
        queryFn: () => getJson<DeviceSummary>(`/api/devices/${id}`),
        enabled: Number.isFinite(id) && id > 0,
    });
}

export function useRecentAlerts() {
    return useQuery({
        queryKey: queryKeys.alerts.recent(),
        queryFn: () => getJson<AlertSummary[]>('/api/alerts'),
    });
}

export function useSiteAlerts(slug: string) {
    return useQuery({
        queryKey: queryKeys.alerts.site(slug),
        queryFn: () => getJson<AlertSummary[]>(`/api/alerts?site=${encodeURIComponent(slug)}`),
        enabled: slug.length > 0,
    });
}

export function useDeviceAlerts(id: number) {
    return useQuery({
        queryKey: queryKeys.alerts.device(id),
        queryFn: () => getJson<AlertSummary[]>(`/api/alerts?device=${id}`),
        enabled: Number.isFinite(id) && id > 0,
    });
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
