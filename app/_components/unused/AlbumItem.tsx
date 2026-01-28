/// <reference types="spotify-api" />

import MediaCard from "../media_comps/MediaCard";
import type { AlbumItemProps } from "@/types/components";

export default function AlbumItem({
  album,
  href,
  className,
  images,
}: AlbumItemProps) {
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