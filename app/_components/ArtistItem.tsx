"use client";

import MediaCard from "./MediaCard";
import PopularityMeter from "./PopularityMeter";
import type { ArtistFull } from "@/types/spotify";
import { abbreviateNumber } from "@/app/_utils/helpers";

interface ArtistItemProps {
  artist: ArtistFull;
  href?: string;
  className?: string;
}

export default function ArtistItem({ artist, href, className }: ArtistItemProps) {
  const image = artist.images?.[0];

  return (
    <MediaCard
      href={href}
      className={className}
      title={artist.name}
      image={
        image
          ? {
              url: image.url,
              width: image.width,
              height: image.height,
              alt: `Artist image of ${artist.name}`,
            }
          : undefined
      }
      meta={
        <>
          {abbreviateNumber(artist.followers?.total) ?? 0} followers
          <PopularityMeter value={artist.popularity} />
        </>
      }
    />
  );
}