// app/_components/TrackList.tsx
"use client";

import TrackRow from "./TrackRow";

interface Disc {
  discNumber: number;
  tracks: any[];
}

interface TrackListProps {
  discs: Disc[];
  highlightId?: string;
}

export default function TrackList({ discs, highlightId }: TrackListProps) {
  return (
    <div className="flex flex-col gap-4">
      {discs.map(disc => (
        <div key={disc.discNumber}>
          {discs.length > 1 && (
            <h3 className="text-sm font-semibold mb-1">Disc {disc.discNumber}</h3>
          )}
          <ul className="flex flex-col gap-1">
            {disc.tracks.map((track, i) => (
              <TrackRow
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