"use client";

import Link from "next/link";
import MediaFigure from "./MediaFigure";
import type { MediaCardProps } from "@/types/components";
import { backroundGradient } from "@/app/_utils/helpers";
import { useState, useEffect } from "react";

export default function MediaCard({
  images,
  title,
  meta,
  href,
  type,
  className = "",
}: MediaCardProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link href={href ?? "#"} className="block h-full">
      <div
        className={`
          flex flex-col h-full gap-2
          border border-iplay-white/10 rounded-md
          overflow-hidden bg-iplay-black/50
          shadow-md/10 shadow-iplay-grape
          transition-transform duration-500 ease-out
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          hover:scale-[1.015]
          ${className}
        `}
      >
        <figure className="w-full overflow-hidden border-b border-iplay-white/10 relative">
          <div className={`w-full h-full ${type === "genre" ? "grayscale" : ""}`}>
            <MediaFigure images={images} fallbackType={type as any} />
          </div>

          {type === "genre" && title && (
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: backroundGradient(title) }}
            />
          )}
        </figure>

        <div className="flex flex-col gap-1 px-2 pb-4 flex-1 min-h-[3.5rem]">
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