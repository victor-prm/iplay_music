import Link from "next/link";
import { MediaFigure } from "./MediaFigure";
import type { MediaCardProps } from "@/types/media";

export default function MediaCard({
    images,
    title,
    meta,
    href,
    className = "",
    index = 0,
}: MediaCardProps) {
    const content = (
        <div
            className={`flex flex-col gap-2 border border-iplay-white/10 rounded-md shadow-2xl/10 shadow-iplay-grape overflow-hidden ${className}`}
        >
            <figure className="w-full aspect-square overflow-hidden border-b border-iplay-white/10">
                <MediaFigure images={images} />
            </figure>

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