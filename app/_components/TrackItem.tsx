"use client";

import { useEffect, useRef, useState } from "react";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "@/app/_utils/helpers";
import type { TrackRowProps, MediaImage } from "@/types/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPlay } from "react-icons/fa";


export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname(); // current path
  const { name, album, artists } = track;
  const [hovered, setHovered] = useState(false);

  // Only link to album if we're NOT already on an album page
  const linkToAlbum = album?.id && !pathname?.startsWith("/album");

  // Take only the first image from the album
  const image: MediaImage | undefined = spotifyImagesToMediaImages(album?.images, name)?.[0];

  // Only show album image if NOT on album page
  const showAlbumImage = !pathname?.startsWith("/album") && image;

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  return (
    <li
      ref={ref}
      className={`flex items-center gap-2 p-2 transition-colors
        hover:opacity-70 cursor-pointer
        ${highlighted ? "bg-iplay-pink/20! ring-1! ring-iplay-pink!" : ""}
        even:bg-iplay-white/2.5`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index / Play Icon */}
      <div className="flex size-10 justify-center items-center h-full relative shrink-0">
        {!hovered && index != null && <span className="opacity-50">{index}</span>}
        {hovered && (
          <div className="absolute inset-0 flex justify-center items-center">
            <FaPlay className="size-3 text-iplay-white" />
          </div>
        )}
      </div>

      {/* Album image */}
      {showAlbumImage && (
        <div className="size-10 overflow-hidden rounded-sm font-poppins">
          <MediaFigure images={[image]} />
        </div>
      )}

      <div className="flex flex-col min-w-0 font-dm-sans">
        {/* Track name */}
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

        {/* Artists */}
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