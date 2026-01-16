"use client";

interface FilterRadiosProps {
    value: string;
    onChange: (value: string) => void;
    options?: string[]; // optional override
}

export default function FilterRadios({
    value,
    onChange,
    options = ["all", "artist", "album", "track", "playlist"],
}: FilterRadiosProps) {
    return (
        <div className="flex gap-2 mb-2">
            {options.map((opt) => (
                <label key={opt} className="flex items-center gap-1">
                    <input
                        type="radio"
                        name="filter"
                        value={opt}
                        checked={value === opt}
                        onChange={() => onChange(opt)}
                    />
                    <span className="capitalize">{opt}</span>
                </label>
            ))}
        </div>
    );
}