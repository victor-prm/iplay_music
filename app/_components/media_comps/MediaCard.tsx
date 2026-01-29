"use client";

import Link from "next/link";
import MediaFigure from "./MediaFigure";
import type { MediaCardProps, MediaImage, UpToFour } from "@/types/components";
import { backroundGradient } from "@/app/_utils/helpers";
import { useState, useEffect } from "react";

type MediaCardPropsExtended = MediaCardProps & {
  /**
   * Shape of the card while loading.
   * "square" = 1:1, "wide" = ~16:9, "tall" = ~3:5
   */
  loadingShape?: "square" | "wide" | "tall";
};

export default function MediaCard({
  images,
  title,
  meta,
  href,
  type,
  className = "",
  loadingShape = "square",
}: MediaCardPropsExtended) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  // Called when MediaFigure finishes loading images
  const handleImagesLoaded = () => setLoading(false);

  // Determine aspect ratio for loading state only
  let aspectClass = "aspect-square"; // 1:1 default
  if (loading) {
    switch (loadingShape) {
      case "wide":
        aspectClass = "aspect-[2.5]"; // your preferred wide ratio
        break;
      case "tall":
        aspectClass = "aspect-[0.5]"; // your preferred tall ratio
        break;
      default:
        aspectClass = "aspect-square"; // 1:1
    }
  }

  return (
    <Link href={href ?? "#"} className="block h-full">
      <div
        className={`
          flex flex-col h-full gap-2
          border border-iplay-white/10 rounded-md
          overflow-hidden bg-iplay-black/50
          shadow-md/10 shadow-iplay-grape
          transition-all duration-500 ease-out
          hover:scale-[1.015]
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          ${loading ? "animate-pulse" : ""}
          ${className}
        `}
      >
        {/* Figure with placeholder aspect ratio while loading */}
        <figure
          className={`w-full overflow-hidden border-b border-iplay-white/10 relative ${loading ? aspectClass : ""}`}
        >
          <MediaFigure
            images={images}
            fallbackType={type as any}
            applyGrayscale={mounted && type === "genre"}
            onImagesLoaded={handleImagesLoaded}
            fillContainer={true} // ensure images fill the figure height
            loading={loading}
            loadingShape={loadingShape}
          />

          {type === "genre" && title && (
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: backroundGradient(title) }}
            />
          )}
        </figure>

        <div className="flex flex-col gap-1 px-2 pb-4 min-h-14">
          <h2 className="text-md font-poppins font-bold line-clamp-1">{title}</h2>
          {meta && (
            <div className="text-sm opacity-70 flex flex-wrap items-center gap-2 font-dm-sans">
              {meta}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}