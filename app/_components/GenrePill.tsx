"use client";

import Link from "next/link";
import { backroundGradient } from "@/app/_utils/helpers";

interface GenrePillProps {
    genre: string;
    href?: string;
}

export default function GenrePill({ genre, href }: GenrePillProps) {
    return (
        <Link
            href={href ?? "#"}
            className="relative px-3 py-1.5 rounded-md h-12 overflow-clip 
            font-poppins text-xs font-semibold text-white flex items-end
            text-shadow-2xs text-shadow-iplay-black/50 uppercase
            hover:opacity-80 transition-opacity"
        >
            <span
                className="grayscale-25 absolute opacity-75 inset-0 -z-1"
                style={{ background: backroundGradient(genre) }}
            ></span>
            {genre}
        </Link>
    );
}