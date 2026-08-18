export type ReadingPoint = {
    value: number;
    recorded_at: string;
};

export type DeviceSummary = {
    id: number;
    name: string;
    metric: string;
    metric_label: string;
    unit: string;
    site?: {
        name: string;
        slug: string;
        town: string;
    };
    latest_reading?: ReadingPoint | null;
    readings?: ReadingPoint[];
};

export type SiteSummary = {
    id: number;
    name: string;
    slug: string;
    town: string;
    devices?: DeviceSummary[];
};

export type AlertSummary = {
    id: number;
    message: string;
    triggered_at: string;
    acknowledged_at: string | null;
    is_open: boolean;
    device?: {
        id: number;
        name: string;
        metric_label: string;
        site_town: string | null;
    };
};
