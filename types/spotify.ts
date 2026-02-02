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

export { };

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: typeof Spotify.Player;
    };
  }

  namespace Spotify {
    interface PlayerInit {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }

    interface Player {
      connect(): Promise<boolean>;
      disconnect(): void;
      togglePlay(): Promise<void>;
      seek(positionMs: number): Promise<void>;
      addListener(
        event: "ready" | "player_state_changed",
        callback: (state: any) => void
      ): void;
    }

    const Player: {
      new(options: PlayerInit): Player;
    };
  }
}

