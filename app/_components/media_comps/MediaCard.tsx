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
    <Link href={href ?? "#"} className="rounded-sm hover:bg-iplay-white/5 overflow-hidden block h-full">
      <div
        className={`
          group
          flex flex-col h-full gap-1 p-1
          ${loading ? "animate-pulse" : ""}
          ${className}
        `}
      >
        <figure
          className={`w-full rounded-sm overflow-hidden relative
          transition-transform duration-300 ease-out
          group-hover:scale-[1.01]  
          ${loading ? aspectClass : ""}`}
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

        <div className="min-h-12">
          {!loading ? (
            <h2 className="text-md font-poppins font-bold line-clamp-1">
              {title}
            </h2>
          ) : (
            <div className="h-4 bg-white/10 w-32 rounded-sm mb-1" />
          )}

          {!loading && meta ? (
            <div className="text-xs opacity-70 flex flex-wrap items-center gap-2 font-dm-sans">
              {meta}
            </div>
          ) : loading ? (
            <div className="h-3 bg-white/10 w-56 rounded-sm" />
          ) : null}
        </div>
      </div>
    </Link >
  );
}