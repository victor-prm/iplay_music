/// <reference types="spotify-api" />

import type { ArtistFull, AlbumFull, TrackFull, PlaylistFull, Disc} from "@/types/spotify";

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

// Media
export interface MediaImage {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
}

export interface MediaCardProps {
    images?: MediaImage[];
    title: string;
    meta?: React.ReactNode;
    href?: string;
    className?: string;
    index?: number;
}

// Filters
export type FilterOptions = "all" | "artist" | "album" | "track" | "playlist";

export interface FilterRadiosProps {
    value: FilterOptions;
    onChange: (value: FilterOptions) => void;
    options?: FilterOptions[];
}

// Search
export type SearchResultType = "artist" | "album" | "track" | "playlist";

export type SearchResult =
  | { type: "artist"; item: ArtistFull }
  | { type: "album"; item: AlbumFull }
  | { type: "track"; item: TrackFull }
  | { type: "playlist"; item: PlaylistFull };

export interface MusicItemProps {
    res: SearchResult;
    onSelect: () => void;
}

export interface TrackRowProps {
  track: TrackFull;
  index?: number;
  highlighted?: boolean;
}

export interface TrackListProps {
  discs: Disc[];
  highlightId?: string;
}