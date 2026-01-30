"use client";

import { useEffect, useRef } from "react";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "@/app/_utils/helpers";
import type { TrackRowProps, MediaImage } from "@/types/components";

export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { name, album, artists } = track;

  // Take only the first image from the album
  const image: MediaImage | undefined = spotifyImagesToMediaImages(album?.images, name)?.[0];

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  return (
    <li
      ref={ref}
      className={`flex items-center gap-2 p-2 transition-colors
        even:bg-iplay-white/5
        ${highlighted ? "bg-iplay-pink/20 ring-2 ring-iplay-pink" : ""
        }`}
    >
      <div className="flex size-10 justify-center items-center h-full">
        {index != null && (
          <span className="opacity-50">{index}</span>
        )}
      </div>

      {image && (
        <div className="size-10 overflow-hidden rounded-sm font-poppins">
          <MediaFigure images={[image]} /> {/* wrap in array */}
        </div>
      )}

      <div className="flex flex-col min-w-0 font-dm-sans">
        <span className="truncate">{name}</span>
        <small className="opacity-50 truncate">
          {artists?.map(a => a.name).join(" • ")}
        </small>
      </div>
    </li>
  );
}