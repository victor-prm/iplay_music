// app/_components/ArtistItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import PopularityMeter from "./PopularityMeter";
import type { ArtistFull } from "@/types/spotify";
import { abbreviateNumber } from "@/app/_utils/helpers";

interface ArtistItemProps {
  artist: ArtistFull;
  href?: string;
  className?: string; // optional extra classes
}

export default function ArtistItem({ artist, href, className = "" }: ArtistItemProps) {
  const content = (
    <div
      className={`flex flex-col gap-2 border border-iplay-white/10 rounded-md shadow-2xl/10 shadow-iplay-grape overflow-hidden ${className}`}
    >
      {/* Artist Image */}
      {artist.images?.[0] && (
        <figure className="w-full aspect-square overflow-hidden">
          <Image
            src={artist.images[0].url}
            alt={`Artist image of ${artist.name}`}
            width={artist.images[0].width}
            height={artist.images[0].height}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </figure>
      )}

      {/* Artist Info */}
      <div className="flex flex-col gap-1 px-2 pb-4">
        <strong className="text-lg">{artist.name}</strong>
        <span className="text-sm opacity-70 flex items-center gap-2">
          {abbreviateNumber(artist.followers?.total) ?? 0} followers
          <PopularityMeter value={artist.popularity} />
        </span>
      </div>
    </div>
  );

  return href ? <Link href={href} className="block">{content}</Link> : content;
}