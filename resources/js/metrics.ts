export function isOutOfRange(metric: string, value: number): boolean {
    if (metric === 'temperature') {
        return value > 6;
    }

    if (metric === 'humidity' || metric === 'fill') {
        return value > 92;
    }

    return false;
}

export function formatReading(value: number, unit: string): string {
    return `${value.toFixed(1)}${unit}`;
}
