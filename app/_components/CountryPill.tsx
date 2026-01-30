"use client";

import Image from "next/image";
import Link from "next/link";

interface CountryPillProps {
    country: { adjective: string; code: string };
    href?: string;
}

export default function CountryPill({ country, href }: CountryPillProps) {
    return (
        <Link
            href={href ?? "#"}
            className="relative rounded-md h-12 flex items-end gap-2
                 font-poppins text-xs font-semibold text-white bg-iplay-white/10
                 text-shadow-2xs text-shadow-iplay-black overflow-clip
                 hover:opacity-80 transition-opacity"
        >
            <Image
                src={`https://flagsapi.com/${country.code}/flat/32.png`}
                alt={country.adjective}
                width={120}
                height={120}
                className="absolute -rotate-10 w-full object-fit translate-y-[40%] blur-lg opacity-75 grayscale-25"
            />
            {<span className="px-3 py-1.5 z-10">{country.adjective}</span>}
        </Link>
    );
}