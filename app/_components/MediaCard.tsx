// app/_components/MediaCard.tsx
import Link from "next/link";
import { MediaFigure } from "./MediaFigure";
import type { MediaCardProps } from "@/types/components";

export default function MediaCard({
  images,
  title,
  meta,
  href,
  className = "",
  loading = false,
}: MediaCardProps) {
  const content = loading ? (
    <div
      className={`flex flex-col gap-2 border border-iplay-white/10 rounded-md overflow-hidden animate-pulse ${className}`}
    >
      <div className="w-full aspect-square bg-iplay-white/5" /> {/* image skeleton */}
      <div className="flex flex-col gap-1 px-2 pb-4">
        <div className="h-4 w-3/4 bg-iplay-white/5 rounded-sm mb-1" /> {/* title skeleton */}
        <div className="h-4 w-full bg-iplay-white/10 rounded-sm" /> {/* meta skeleton */}
      </div>
    </div>
  ) : (
    <div
      className={`flex flex-col h-full gap-2 border border-iplay-white/10 rounded-md shadow-2xl/10 shadow-iplay-grape overflow-hidden ${className}`}
    >
      <figure className="w-full aspect-square overflow-hidden border-b border-iplay-white/10">
        <MediaFigure images={images} />
      </figure>

      <div className="flex flex-col gap-1 px-2 pb-4">
        <h2 className="text-md font-poppins font-bold line-clamp-1">{title}</h2>
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