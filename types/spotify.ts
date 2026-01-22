export type AlbumFull = SpotifyApi.AlbumObjectFull;
export type TrackFull = SpotifyApi.TrackObjectFull;
export type ArtistFull = SpotifyApi.ArtistObjectFull;
export type PlaylistFull = SpotifyApi.PlaylistObjectFull;

export interface Disc {
  discNumber: number;
  tracks: SpotifyApi.TrackObjectFull[];
}

export interface ImageObject {
  url: string;
  height?: number;
  width?: number;
}