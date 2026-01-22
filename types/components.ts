import type { ArtistFull, AlbumFull } from "./spotify";

// ArtistItem props
export interface ArtistItemProps {
  artist: ArtistFull;
  href?: string;
  className?: string;
  index?: number;
}

// AlbumItem props
export interface AlbumItemProps {
  album: AlbumFull | SpotifyApi.AlbumObjectSimplified;
  href?: string;
  className?: string;
}