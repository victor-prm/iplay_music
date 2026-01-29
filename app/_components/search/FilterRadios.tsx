"use client";

import { FilterRadiosProps } from "@/types/components";

export default function FilterRadios({
    value,
    onChange,
    options = ["all", "artist", "album", "track", "playlist"],
}: FilterRadiosProps) {
    const labelBase = "flex items-center justify-center px-2.5 p-0.5 text-xs rounded-full border-2 cursor-pointer";
    const active = "bg-iplay-orange text-white border-iplay-coral/25";
    const inactive = "bg-iplay-grape/50 text-iplay-white border-iplay-white/10";
    return (
        <div className="flex gap-1">
            {options.map((opt) => (

                <label key={opt} aria-checked={value === opt} className={`${labelBase} ${value === opt ? active : inactive}` }>
                    <input
                        type="radio"
                        role="radio"
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