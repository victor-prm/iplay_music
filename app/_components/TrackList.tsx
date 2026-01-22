"use client";

import TrackItem from "./TrackItem";
import type { TrackFull } from "@/types/spotify";
import type { TrackListProps } from "@/types/components";


export default function TrackList({ discs, highlightId }: TrackListProps) {
  return (
    <div className="flex flex-col gap-4">
      {discs.map((disc) => (
        <div key={disc.discNumber}>
          {discs.length > 1 && (
            <h3 className="text-sm font-semibold mb-1">Disc {disc.discNumber}</h3>
          )}
          <ul className="flex flex-col gap-1">
            {disc.tracks.map((track: TrackFull, i: number) => (
              <TrackItem
                key={track.id}
                track={track}
                index={i + 1}
                highlighted={track.id === highlightId}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}