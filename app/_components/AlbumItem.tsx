/// <reference types="spotify-api" />

import MediaCard from "./MediaCard";
import type { AlbumItemProps } from "@/types/components";
import type { MediaImage } from "@/types/media";

export default function AlbumItem({ album, href, className }: AlbumItemProps) {
  const images: MediaImage[] =
    album.images?.map((img) => ({
      url: img.url,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
      alt: `Album cover for ${album.name}`,
    })) ?? [];

  return (
    <MediaCard
      href={href}
      className={className}
      title={album.name}
      images={images}
      meta={album.artists.map((a) => a.name).join(" • ")}
    />
  );
}