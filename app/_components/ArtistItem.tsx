"use client";

import MediaCard from "./MediaCard";
import PopularityMeter from "./PopularityMeter";
import { abbreviateNumber } from "@/app/_utils/helpers";
import type { ArtistItemProps } from "@/types/components";
import type { MediaImage } from "@/types/media";

export default function ArtistItem({
  artist,
  href,
  className,
  index,
}: ArtistItemProps) {
  const images: MediaImage[] | undefined = artist.images?.length
    ? [
        {
          url: artist.images[0].url,
          width: artist.images[0].width,
          height: artist.images[0].height,
          alt: `Artist image of ${artist.name}`,
        },
      ]
    : undefined;

  return (
    <MediaCard
      href={href}
      className={className}
      title={artist.name}
      images={images}
      index={index}
      meta={
        <>
          {abbreviateNumber(artist.followers?.total) ?? 0} followers
          <PopularityMeter value={artist.popularity} />
        </>
      }
    />
  );
}