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
                    ${value === opt ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-500 border-gray-500"}
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
                    <span className="capitalize">{opt}</span>
                </label>
            ))}
        </div>
    );
}