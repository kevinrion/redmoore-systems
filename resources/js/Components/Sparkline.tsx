type SparklineProps = {
    points: { value: number }[];
    unit: string;
    className?: string;
};

export default function Sparkline({ points, unit, className = '' }: SparklineProps) {
    if (points.length < 2) {
        return <p className={`text-sm text-ink/55 ${className}`}>Not enough readings to chart yet.</p>;
    }

    const width = 640;
    const height = 180;
    const padY = 8;
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const path = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = padY + (height - padY * 2) - ((value - min) / span) * (height - padY * 2);
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(' ');

    return (
        <div className={className}>
            <div className="mb-2 flex justify-between text-xs text-ink/50">
                <span>
                    High {max.toFixed(1)}
                    {unit}
                </span>
                <span>
                    Low {min.toFixed(1)}
                    {unit}
                </span>
            </div>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-44 w-full"
                role="img"
                aria-label="Reading trend for the last seven days"
            >
                <line x1="0" x2={width} y1={height / 2} y2={height / 2} stroke="#1E2014" strokeOpacity="0.08" />
                <path d={path} fill="none" stroke="#7D0308" strokeWidth="2.5" />
            </svg>
            <p className="mt-1 text-xs text-ink/45">Last 7 days</p>
        </div>
    );
}
