"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";

interface SpotifyPlayerContextValue {
    player: Spotify.Player | null;
    deviceId: string | null;
    currentTrackId: string | null;
    isPaused: boolean;
    positionMs: number;
    durationMs: number;

    isPlayerVisible: boolean;
    setIsPlayerVisible: React.Dispatch<React.SetStateAction<boolean>>;

    playTrack: (spotifyUri: string) => void;

    // Update type to match the new signature:
    playContext: (
        contextUri?: string,
        clickedTrackUris?: string[],
        fullQueue?: string[]
    ) => void;

    togglePlay: () => void;
    token: string;
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
    const [isPlayerVisible, setIsPlayerVisible] = useState(true);
    const [queue, setQueue] = useState<string[]>([]); // array of Spotify track URIs
    const [queueIndex, setQueueIndex] = useState<number>(0);
    const queueIndexRef = useRef(queueIndex);
    useEffect(() => {
        queueIndexRef.current = queueIndex;
    }, [queueIndex]);

    const queueRef = useRef<string[]>([]);
    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

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

            let trackFinishedHandled = false;

            sdkPlayer.addListener("player_state_changed", (state: any) => {
                if (!state) return;

                setCurrentTrackId(state.track_window?.current_track?.id ?? null);
                setIsPaused(state.paused);
                setPositionMs(state.position);
                setDurationMs(state.duration);

                const currentQueue = queueRef.current;
                const currentIndex = queueIndexRef.current;

                // Track almost finished
                const isTrackEnding = !state.paused && state.position >= state.duration - 200;

                if (
                    isTrackEnding &&
                    currentQueue.length > 0 &&
                    currentIndex < currentQueue.length - 1 &&
                    !trackFinishedHandledRef.current
                ) {
                    trackFinishedHandledRef.current = true;
                    const nextIndex = currentIndex + 1;
                    queueIndexRef.current = nextIndex;
                    setQueueIndex(nextIndex);
                    playTrack(currentQueue[nextIndex]);
                }

                if (state.position < state.duration - 200) {
                    trackFinishedHandledRef.current = false;
                }

                // Reset flag if track restarted or playing again
                if (state.position < state.duration - 200) {
                    trackFinishedHandled = false;
                }
            });

            sdkPlayer.connect();
            setPlayer(sdkPlayer);

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

        setCurrentTrackId(spotifyUri); // so TrackItem updates immediately

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
    const trackFinishedHandledRef = useRef(false);

    // Play a context (album/playlist) and start at a specific track
    const playContext = (
        contextUri?: string,
        clickedTrackUris?: string[], // clicked track(s)
        fullQueue?: string[]         // full list
    ) => {
        if (!deviceId || !clickedTrackUris?.length || !fullQueue?.length) return;

        const clickedTrackUri = clickedTrackUris[0];

        // Simplified: slice the queue from the clicked track onward
        const startIndex = fullQueue.indexOf(clickedTrackUri);
        const slicedQueue = fullQueue.slice(startIndex); // everything from clicked track to end

        // Update state
        setQueue(slicedQueue);
        queueRef.current = slicedQueue;

        setQueueIndex(0);           // always 0 because queue is sliced
        queueIndexRef.current = 0;

        setCurrentTrackId(clickedTrackUri);

        const body: any = {};
        if (contextUri) {
            body.context_uri = contextUri;
            body.offset = { uri: clickedTrackUri };
        } else {
            body.uris = slicedQueue;
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

    // Toggle pause/play on the current track
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

                isPlayerVisible,
                setIsPlayerVisible,

                playTrack,
                playContext,
                togglePlay,
                token,
            }}
        >
            {children}
        </SpotifyPlayerContext.Provider>
    );
}