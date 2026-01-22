"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ThumbnailFallback from "./ThumbnailFallback";
import type { TrackRowProps } from "@/types/components";

export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);

  const { name, album, artists } = track;
  const thumbnail = album?.images?.[0];

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
      {index != null && <span className="w-6 text-right opacity-50">{index}</span>}

      {thumbnail ? (
        <Image
          src={thumbnail.url}
          alt={name}
          width={40}
          height={40}
          className="rounded-sm object-cover"
        />
      ) : (
        <ThumbnailFallback />
      )}

      <div className="flex flex-col">
        <span>{name}</span>
        <small className="opacity-50">
          {artists?.map((a) => a.name).join(" • ")}
        </small>
      </div>
    </li>
  );
}