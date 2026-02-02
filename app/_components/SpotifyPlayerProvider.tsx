"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SpotifyPlayerContextValue {
    player: Spotify.Player | null;
    deviceId: string | null;
    currentTrackId: string | null;
    isPaused: boolean;
    positionMs: number;
    durationMs: number;
    playTrack: (spotifyUri: string) => void;
    playContext: (contextUri: string, offsetTrackUri?: string) => void;
    togglePlay: () => void;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextValue | undefined>(undefined);

export function useSpotifyPlayer() {
    const ctx = useContext(SpotifyPlayerContext);
    if (!ctx) throw new Error("useSpotifyPlayer must be used within a SpotifyPlayerProvider");
    return ctx;
}

interface ProviderProps {
    children: ReactNode;
    token: string; // Spotify OAuth token
}

export default function SpotifyPlayerProvider({ children, token }: ProviderProps) {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [positionMs, setPositionMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);

    useEffect(() => {
        if (!token || typeof window === "undefined") return;

        // Inject Spotify Web Playback SDK once
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

            sdkPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
                setDeviceId(device_id);
                console.log("Spotify Player Ready with device ID", device_id);
            });

            sdkPlayer.addListener("player_state_changed", (state: any) => {
                if (!state) return;

                setCurrentTrackId(state.track_window?.current_track?.id ?? null);
                setIsPaused(state.paused);
                setPositionMs(state.position);
                setDurationMs(state.duration);
            });

            sdkPlayer.connect();
            setPlayer(sdkPlayer);
        };

        return () => {
            player?.disconnect();
        };
    }, [token]);

    // Play a single track URI
    const playTrack = (spotifyUri: string) => {
        if (!deviceId) return;

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify({ uris: [spotifyUri] }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    // Play a context (album/playlist) and optionally start at a specific track
    const playContext = (contextUri: string, offsetTrackUri?: string) => {
        if (!deviceId) return;

        const body: any = { context_uri: contextUri };
        if (offsetTrackUri) {
            body.offset = { uri: offsetTrackUri };
        }

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
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
                positionMs,
                durationMs,
                playTrack,
                playContext,
                togglePlay,
            }}
        >
            {children}
        </SpotifyPlayerContext.Provider>
    );
}