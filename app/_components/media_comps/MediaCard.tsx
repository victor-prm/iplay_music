"use client";

import Link from "next/link";
import MediaFigure from "./MediaFigure";
import type { MediaCardProps } from "@/types/components";
import { backroundGradient } from "@/app/_utils/helpers";

type MediaCardPropsExtended = MediaCardProps & {
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
  const loading = images === undefined;

  let aspectClass = "aspect-square";
  if (loading) {
    if (loadingShape === "wide") aspectClass = "aspect-[2.5]";
    if (loadingShape === "tall") aspectClass = "aspect-[0.5]";
  }

  return (
    <Link href={href ?? "#"} className="block h-full">
      <div
        className={`
          flex flex-col h-full gap-2
          border border-iplay-white/10 rounded-md
          overflow-hidden bg-iplay-black/50
          shadow-md/10 shadow-iplay-grape
          transition-transform duration-300 ease-out
          hover:scale-[1.015]
          ${loading ? "animate-pulse" : ""}
          ${className}
        `}
      >
        <figure
          className={`w-full overflow-hidden border-b border-iplay-white/10 relative ${loading ? aspectClass : ""}`}
        >
          <MediaFigure
            images={images}
            fallbackType={type as any}
            applyGrayscale={!loading && type === "genre"}
            fillContainer
            loading={loading}
            loadingShape={loadingShape}
          />

          {type === "genre" && title && !loading && (
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: backroundGradient(title) }}
            />
          )}
        </figure>

        <div className="flex flex-col gap-1 px-2 pb-4 min-h-14">
          <h2 className="text-md font-poppins font-bold line-clamp-1">
            {title}
          </h2>

          {!loading && meta && (
            <div className="text-sm opacity-70 flex flex-wrap items-center gap-2 font-dm-sans">
              {meta}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}