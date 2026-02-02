"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SpotifyPlayerContextValue {
  player: Spotify.Player | null;
  deviceId: string | null;
  currentTrackId: string | null;
  isPaused: boolean;
  playTrack: (spotifyUri: string) => void;
  togglePlay: () => void;
}

const SpotifyPlayerContext =
  createContext<SpotifyPlayerContextValue | undefined>(undefined);

export function useSpotifyPlayer() {
  const ctx = useContext(SpotifyPlayerContext);
  if (!ctx) {
    throw new Error(
      "useSpotifyPlayer must be used within a SpotifyPlayerProvider"
    );
  }
  return ctx;
}

interface ProviderProps {
  children: ReactNode;
  token: string; // access token from your OAuth flow
}

export default function SpotifyPlayerProvider({
  children,
  token,
}: ProviderProps) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!token || typeof window === "undefined") return;

    // Avoid injecting the SDK script multiple times
    if (!document.getElementById("spotify-player-sdk")) {
      const script = document.createElement("script");
      script.id = "spotify-player-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const sdkPlayer = new window.Spotify.Player({
        name: "iPlay School Project",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      sdkPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          setDeviceId(device_id);
          console.log("Spotify Player Ready with device ID", device_id);
        }
      );

      sdkPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setCurrentTrackId(
          state.track_window?.current_track?.id ?? null
        );
        setIsPaused(state.paused);
      });

      sdkPlayer.connect();
      setPlayer(sdkPlayer);
    };

    return () => {
      player?.disconnect();
    };
  }, [token]);

  const playTrack = (uri: string) => {
    if (!deviceId) return;

    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uris: [uri] }),
      }
    );
  };

  const togglePlay = () => {
    player?.togglePlay();
  };

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        deviceId,
        currentTrackId,
        isPaused,
        playTrack,
        togglePlay,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
}