"use client";

import { useEffect, useRef, useState } from "react";
import MediaFigure from "./media_comps/MediaFigure";
import { spotifyImagesToMediaImages } from "@/app/_utils/helpers";
import type { TrackRowProps, MediaImage } from "@/types/components";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaPlay, FaPause, FaCompactDisc } from "react-icons/fa";
import { useSpotifyPlayer } from "./SpotifyPlayerProvider";

export default function TrackItem({ track, index, highlighted }: TrackRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { name, album, artists } = track;
  const [hovered, setHovered] = useState(false);

  const linkToAlbum = album?.id && !pathname?.startsWith("/album");
  const image: MediaImage | undefined = spotifyImagesToMediaImages(album?.images, name)?.[0];
  const showAlbumImage = !pathname?.startsWith("/album") && image;

  const { playContext, togglePlay, currentTrackId, isPaused } = useSpotifyPlayer();

  const isCurrentTrack = currentTrackId === track.id;
  const isPlaying = isCurrentTrack && !isPaused;

  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [highlighted]);

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      togglePlay(); // pause/resume if same track
    } else if (track.uri) {
      playContext(album.uri, track.uri);

      // Remove highlight from URL if it exists
      const url = new URL(window.location.href);
      if (url.searchParams.has("highlight")) {
        url.searchParams.delete("highlight");
        router.replace(url.toString());
      }
    }
  };

  return (
    <li
      ref={ref}
      className={`relative flex items-center gap-2 p-2 transition-colors
        even:bg-iplay-white/2.5
        ${highlighted ? "bg-iplay-pink/20! ring-1! ring-iplay-pink!" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Clickable overlay for the entire item except links */}
      <div
        className="absolute inset-0 cursor-pointer z-0"
        onClick={handlePlayPause}
      >
        {hovered && (
          <div className="absolute inset-0 bg-iplay-white/1 pointer-events-none transition-colors" />
        )}
      </div>

      {/* Index / Disc / Play-Pause */}
      <div className="flex size-10 justify-center items-center h-full relative shrink-0 z-10">
        {hovered ? (
          // Hover state fully overrides
          <div
            className="absolute inset-0 flex justify-center items-center z-20"
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
          >
            {isCurrentTrack && !isPaused ? (
              <FaPause className="size-3 text-iplay-white" />
            ) : (
              <FaPlay className="size-3 text-iplay-white" />
            )}
          </div>
        ) : (
          // Non-hover: index/disc states
          <>
            {!isCurrentTrack && (
              <span className="opacity-50">{index}</span>
            )}

            {isCurrentTrack && (
              <FaCompactDisc
                className={`size-4 transition-colors ${isPlaying ? "animate-spin text-iplay-coral" : "text-iplay-white/70"
                  }`}
              />
            )}
          </>
        )}
      </div>

      {/* Album image */}
      {showAlbumImage && (
        <div className="size-10 overflow-hidden rounded-sm font-poppins z-10">
          <MediaFigure images={[image]} />
        </div>
      )}

      {/* Track details */}
      <div className="flex flex-col min-w-0 font-dm-sans z-10">
        <span className={`truncate ${isCurrentTrack && "text-iplay-coral"}`}>
          {linkToAlbum ? (
            <Link
              href={`/album/${album.id}?highlight=${track.id}`}
              className={``}
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
              <Link
                href={`/artist/${a.id}`}
                className={`hover:underline relative z-20 ${isCurrentTrack && "text-iplay-coral"}`}
              >
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