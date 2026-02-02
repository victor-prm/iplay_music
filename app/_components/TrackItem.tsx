"use client";

import { useEffect, useRef } from "react";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "@/app/_utils/helpers";
import type { TrackRowProps, MediaImage } from "@/types/components";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname(); // get current path
  const { name, album, artists } = track;

  // Take only the first image from the album
  const image: MediaImage | undefined = spotifyImagesToMediaImages(album?.images, name)?.[0];

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  // Only link to album if we're NOT already on an album page
  const linkToAlbum = album?.id && !pathname?.startsWith("/album");

  return (
    <li
      ref={ref}
      className={`flex items-center gap-2 p-2 transition-colors
  ${highlighted ? "bg-iplay-pink/20! ring-1! ring-iplay-pink!" : ""}
  even:bg-iplay-white/2.5`}
    >
      <div className="flex size-10 justify-center items-center h-full">
        {index != null && <span className="opacity-50">{index}</span>}
      </div>

      {image && (
        <div className="size-10 overflow-hidden rounded-sm font-poppins">
          <MediaFigure images={[image]} />
        </div>
      )}

      <div className="flex flex-col min-w-0 font-dm-sans">
        <span className="truncate">
          {linkToAlbum ? (
            <Link
              href={`/album/${album.id}?highlight=${track.id}`}
              className="hover:underline"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </span>

        <small className="opacity-50 truncate">
          {artists?.map((a, i) => (
            <span key={a.id ?? a.name}>
              <Link href={`/artist/${a.id}`} className="hover:underline">
                {a.name}
              </Link>
              {i < artists.length - 1 && " • "}
            </span>
          ))}
        </small>
      </div>
    </li>
  );
}