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
        <div className="flex gap-1">
            {options.map((opt) => (
                <label
                    key={opt}
                    className={`flex items-center justify-center px-2.5 p-0.5 text-xs rounded-full border-2 cursor-pointer
                    ${value === opt ? "bg-iplay-orange text-white border-iplay-coral/25" : "bg-iplay-grape/50 text-iplay-white border-iplay-white/10"}
                    `}
                >
                    <input
                        type="radio"
                        name="filter"
                        value={opt}
                        checked={value === opt}
                        onChange={() => onChange(opt)}
                        className="sr-only" // hides the input but keeps it accessible
                    />
                    <span className="capitalize font-dm-sans">{opt}</span>
                </label>
            ))}
        </div>
    );
}