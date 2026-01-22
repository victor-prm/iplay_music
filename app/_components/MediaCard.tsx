"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { FaMusic } from "react-icons/fa";

interface MediaCardProps {
    image?: {
        url: string;
        width?: number | null;
        height?: number | null;
        alt: string;
    };
    title: string;
    meta?: ReactNode;
    href?: string;
    className?: string;
    index?: number;
}

export default function MediaCard({
    image,
    title,
    meta,
    href,
    className = "",
    index = 0,
}: MediaCardProps) {
    const content = (
        <div
            className={`flex flex-col gap-2  border border-iplay-white/10 rounded-md shadow-2xl/10 shadow-iplay-grape overflow-hidden ${className}`}
            style={{opacity: 0, animation: `300ms fade-in forwards ${String(25+index*25)}ms` }}
        >
            {/* Image */}

            <figure className="flex items-center justify-center w-full aspect-square overflow-hidden border-b border-iplay-white/10">
                {image ? (
                    <Image
                        src={image.url}
                        alt={image.alt}
                        width={image.width ?? 512}
                        height={image.height ?? 512}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />) :
                    (<FaMusic className="size-[33%] text-iplay-grape/50"></FaMusic>)}
            </figure>


            {/* Content */}
            <div className="flex flex-col gap-1 px-2 pb-4">
                <h2 className="text-md font-poppins font-bold">{title}</h2>
                {meta && (
                    <div className="text-sm opacity-70 flex flex-wrap items-center gap-2 font-dm-sans">
                        {meta}
                    </div>
                )}
            </div>
        </div>
    );

    return href ? <Link href={href}>{content}</Link> : content;
}