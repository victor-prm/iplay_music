/// <reference types="spotify-api" />

import MediaCard from "./MediaCard";

interface AlbumItemProps {
  album: SpotifyApi.AlbumObjectSimplified;
  href?: string;
  className?: string;
}

export default function AlbumItem({ album, href, className }: AlbumItemProps) {
  const image = album.images?.[0];

  return (
    <MediaCard
      href={href}
      className={className}
      title={album.name}
      image={
        image
          ? {
              url: image.url,
              width: image.width,
              height: image.height,
              alt: `Album cover for ${album.name}`,
            }
          : undefined
      }
      meta={
        <>
          {album.artists.map((a) => a.name).join(", ")}
        </>
      }
    />
  );
}