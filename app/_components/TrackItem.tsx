// app/_components/TrackRow.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

interface TrackRowProps {
  track: any;
  index?: number;
  highlighted?: boolean;
}

export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);

  // scroll into view if highlighted
  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  const thumbnail = track.album?.images?.[0];

  return (
    <li
      ref={ref}
      className={`flex items-center gap-3 p-2 rounded-sm transition-colors ${
        highlighted ? "bg-iplay-pink/20 ring-2 ring-iplay-pink" : ""
      }`}
    >
      {index && <span className="w-6 text-right opacity-50">{index}</span>}

      {thumbnail ? (
        <Image
          src={thumbnail.url}
          alt={track.name}
          width={40}
          height={40}
          className="rounded-sm object-cover"
        />
      ) : (
        <div className="w-10 h-10 grid place-items-center rounded-sm border border-white/10 bg-iplay-plum">
          <FaMusic className="opacity-40" />
        </div>
      )}

      <div className="flex flex-col">
        <span>{track.name}</span>
        <small className="opacity-50">
          {track.artists?.map((a: any) => a.name).join(", ")}
        </small>
      </div>
    </li>
  );
}