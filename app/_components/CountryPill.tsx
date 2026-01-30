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
            className="relative rounded-md h-12 overflow-clip 
            font-poppins text-xs font-semibold text-white flex items-end
            text-shadow-2xs text-shadow-iplay-black/50 uppercase
            hover:opacity-80 transition-opacit"
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