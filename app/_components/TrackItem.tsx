"use client";

import { useEffect, useRef } from "react";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "@/app/_utils/helpers";
import type { TrackRowProps } from "@/types/components";

export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);

  const { name, album, artists } = track;

  const images = spotifyImagesToMediaImages(album?.images, name);

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  return (
    <li
      ref={ref}
      className={`flex items-center gap-3 p-2 rounded-sm transition-colors ${
        highlighted ? "bg-iplay-pink/20 ring-2 ring-iplay-pink" : ""
      }`}
    >
      {index != null && (
        <span className="w-6 text-right opacity-50">{index}</span>
      )}

      <div className="size-10 overflow-hidden rounded-sm">
        <MediaFigure images={images} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="truncate">{name}</span>
        <small className="opacity-50 truncate">
          {artists?.map((a) => a.name).join(" • ")}
        </small>
      </div>
    </li>
  );
}