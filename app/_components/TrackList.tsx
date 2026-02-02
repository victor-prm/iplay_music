"use client";

import TrackItem from "./TrackItem";
import type { TrackListProps } from "@/types/components";


export default function TrackList({ discs, highlightId, title }: TrackListProps) {
  return (
    <section className="flex flex-col gap-3">
      {title && (
        <h2 className="text-2xl font-bold font-poppins  flex items-center gap-2">
          {title}
        </h2>
      )}

      <div className="bg-iplay-grape/5 rounded-xl overflow-clip">
        {discs.map((disc) => (
          <div key={disc.discNumber}>
            {discs.length > 1 && (
              <h3 className="text-sm font-semibold mb-1">
                Disc {disc.discNumber}
              </h3>
            )}

            <ul className="flex flex-col">
              {disc.tracks.map((track, i) => (
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
    </section>
  )
}