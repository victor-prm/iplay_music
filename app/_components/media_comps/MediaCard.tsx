// app/_components/MediaCard.tsx
import Link from "next/link";
import MediaFigure from "./MediaFigure";
import type { MediaCardProps } from "@/types/components";
import { backroundGradient } from "@/app/_utils/helpers";

export default function MediaCard({
  images,
  title,
  meta,
  href,
  type,
  className = "",
  loading = false,
}: MediaCardProps) {
  return (
    <Link href={href ?? "#"} className="block">
      {/* Container */}
      <div
        className={`
          flex flex-col h-full gap-2 border border-iplay-white/10 rounded-md
          overflow-hidden shadow-md/10 shadow-iplay-grape bg-iplay-black/50
          ${className}
          ${loading ? "animate-pulse" : ""}
        `}
      >
        {/* Image */}
        <figure className="w-full aspect-square overflow-hidden border-b border-iplay-white/10 relative">
          {loading ? (
            <div className="w-full h-full bg-iplay-white/5" />
          ) : (
            <>
              {/* Only the image is grayscale */}
              <div className={`w-full h-full ${type === "genre" && "grayscale"}`}>
                <MediaFigure images={images} />
              </div>

              {/* Gradient overlay for genres */}
              {type === "genre" && title && (
                <div
                  className="absolute inset-0 opacity-50 pointer-events-none"
                  style={{
                    background: backroundGradient(title),
                  }}
                />
              )}
            </>
          )}
        </figure>

        {/* Text */}
        <div className="flex flex-col gap-1 px-2 pb-4">
          {loading ? (
            <>
              <div className="h-4 w-3/4 bg-iplay-white/5 rounded-sm mb-1" /> {/* title skeleton */}
              <div className="h-4 w-full bg-iplay-white/10 rounded-sm" /> {/* meta skeleton */}
            </>
          ) : (
            <>
              <h2 className="text-md font-poppins font-bold line-clamp-1">{title}</h2>
              {meta && (

                <div className="text-sm opacity-70 flex flex-wrap items-center gap-2 font-dm-sans">
                  {meta}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Link >
  );
}