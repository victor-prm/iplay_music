interface PopularityMeterProps {
    value: number; // 0-100
}

export default function PopularityMeter({ value }: PopularityMeterProps) {
    // Clamp value to 0-100
    const clamped = Math.min(Math.max(value, 0), 100);

    // Colors for every 10% range
    const colors = [
        'var(--color-iplay-plum)',     // 0-10
        'var(--color-iplay-grape)',    // 10-20
        'var(--color-iplay-pink)',     // 20-30
        'var(--color-iplay-coral)',    // 30-40
        'var(--color-iplay-magenta)',  // 40-50
        'var(--color-iplay-orange)',   // 50-60
        'var(--color-iplay-yellow)',   // 60-70
        'var(--color-iplay-lime)',     // 70-80
        'var(--color-iplay-teal)',     // 80-90
        'var(--color-iplay-white)',     // 90-100
    ];

    const colorIndex = Math.floor(clamped / 10);
    const color = colors[colorIndex];

    // Only add shadow for lime, teal, blue
    let shadow = 'none';
    if (color === 'var(--color-iplay-lime)') shadow = '0 0 2px ' + color;
    else if (color === 'var(--color-iplay-teal)') shadow = '0 0 6px ' + color;
    else if (color === 'var(--color-iplay-white)') shadow = '0 0 8px ' + color;

    return (
        <div
            className="bg-iplay-white/20 rounded-4xl w-16 h-2 overflow-hidden inline-block"
            style={{ boxShadow: shadow }}
        >
            <div
                className="h-full rounded-4xl transition-all duration-300"
                style={{
                    width: `${clamped}%`,
                    backgroundColor: color,
                    boxShadow: shadow,
                }}
            />
        </div>
    );
}