type SparklineProps = {
    points: { value: number }[];
    className?: string;
};

export default function Sparkline({ points, className = '' }: SparklineProps) {
    if (points.length < 2) {
        return <p className={`text-sm text-ink/60 ${className}`}>Not enough readings to chart yet.</p>;
    }

    const width = 640;
    const height = 160;
    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const path = values
        .map((value, index) => {
            const x = (index / (values.length - 1)) * width;
            const y = height - ((value - min) / span) * height;
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={`h-40 w-full ${className}`} role="img" aria-label="Reading trend">
            <path d={path} fill="none" stroke="#7D0308" strokeWidth="3" />
        </svg>
    );
}
