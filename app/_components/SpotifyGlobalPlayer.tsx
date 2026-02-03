"use client";

import { useSpotifyPlayer } from "./SpotifyPlayerProvider";
import { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import MediaFigure from "./media_comps/MediaFigure";
import { UpToFour, MediaImage } from "@/types/components";

async function getLastPlayback(token: string) {
    const res = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok || res.status === 204) return null;

    return res.json();
}

export default function SpotifyGlobalPlayer() {
    const { player, deviceId, isPaused, token, currentTrackId } = useSpotifyPlayer();

    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [positionMs, setPositionMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);
    const [sliderValue, setSliderValue] = useState(0); // 0–100
    const [isSeeking, setIsSeeking] = useState(false);
    const [basePositionMs, setBasePositionMs] = useState(0);
    const [lastUpdateTs, setLastUpdateTs] = useState(0);

    /* ──────────────────────────────────────────────
       1. Spotify SDK state listener (authoritative)
       ────────────────────────────────────────────── */
    useEffect(() => {
        if (!player) return;

        const handleStateChange = (state: any) => {
            if (!state) return;

            setCurrentTrack(state.track_window.current_track);
            setBasePositionMs(state.position);
            setLastUpdateTs(Date.now());
            setDurationMs(state.duration);
        };

        player.addListener("player_state_changed", handleStateChange);

        (async () => {
            const state = await (player as any).getCurrentState?.();
            if (state) handleStateChange(state);
        })();

        return () => {
            (player as any).removeListener?.("player_state_changed", handleStateChange);
        };
    }, [player]);

    /* ──────────────────────────────────────────────
       2. Load last playback (Spotify or localStorage)
       ────────────────────────────────────────────── */
    useEffect(() => {
        if (!player || !token) return;

        (async () => {
            const lastState = await getLastPlayback(token);
            const track = lastState?.item;

            if (track) {
                setCurrentTrack(track);
                setDurationMs(track.duration_ms);
                setPositionMs(lastState.progress_ms ?? 0);
                localStorage.setItem("lastTrack", JSON.stringify(track));
            } else {
                const storedTrack = localStorage.getItem("lastTrack");
                if (storedTrack) {
                    const parsed = JSON.parse(storedTrack);
                    setCurrentTrack(parsed);
                    setDurationMs(parsed.duration_ms);
                } else {
                    setCurrentTrack(null);
                }
            }
        })();
    }, [player, token]);

    /* ──────────────────────────────────────────────
       3. Slider sync
       ────────────────────────────────────────────── */
    useEffect(() => {
        if (isSeeking || durationMs === 0) return;
        setSliderValue((positionMs / durationMs) * 100);
    }, [positionMs, durationMs, isSeeking]);

    useEffect(() => {
        if (isPaused || isSeeking || durationMs === 0) return;

        const interval = setInterval(() => {
            setSliderValue(prev => Math.min(prev + (100 / (durationMs / 1000)), 100));
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, durationMs, isSeeking]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSeeking(true);
        setSliderValue(Number(e.target.value));
    };

    const handleSliderCommit = async () => {
        if (!player || durationMs === 0) return;

        const seekMs = Math.round((sliderValue / 100) * durationMs);
        await player.seek(seekMs);

        setBasePositionMs(seekMs);
        setLastUpdateTs(Date.now());
        setPositionMs(seekMs);
        setIsSeeking(false);
    };

    /* ──────────────────────────────────────────────
       4. Play last track
       ────────────────────────────────────────────── */
    const handlePlay = async () => {
        if (!player || !deviceId || !currentTrack) return;

        if (currentTrack.id === currentTrackId) {
            player.togglePlay();
            return;
        }

        // Load the track into the player without auto-playing
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris: [currentTrack.uri] }),
        });
    };

    const formatTime = (ms: number) => {
        if (!ms || ms < 0) return "0:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const elapsed = Date.now() - lastUpdateTs;
            setPositionMs(Math.min(basePositionMs + elapsed, durationMs));
        }, 500);

        return () => clearInterval(interval);
    }, [isPaused, basePositionMs, lastUpdateTs, durationMs]);

    useEffect(() => {
        if (!isPaused) return;
        setPositionMs(basePositionMs);
    }, [isPaused, basePositionMs]);

    const lastImage = currentTrack?.album?.images?.[currentTrack.album.images.length - 1];

    const image: UpToFour<MediaImage> = lastImage
        ? [{
            url: lastImage.url,
            width: lastImage.width,
            height: lastImage.height,
            alt: currentTrack.name ?? "Track image",
        }]
        : [];

    return (
        <div className="p-1.5 gap-8 fixed bottom-12 left-0 right-0 max-w-300 mx-auto bg-linear-to-tr from-iplay-coral/15 to-iplay-pink/15 text-white z-50 backdrop-blur-md border border-iplay-coral/50 rounded-t-md">
            <div className="mx-auto grid grid-cols-[1fr_0.5fr_1fr]">
                {/* Track info */}
                <div className="flex gap-1 min-w-0 items-center">
                    <div className="size-9 rounded-sm shrink-0 overflow-hidden border border-iplay-coral/50">
                        <MediaFigure images={image} fillContainer fallbackType="album" fallbackIconClassName="size-4 opacity-50" />
                    </div>
                    <div className="overflow-hidden flex flex-col gap-1 justify-center">
                        <strong className="truncate block font-poppins text-xs leading-tight">
                            {currentTrack?.name || "No track playing"}
                        </strong>
                        <small className="opacity-70 truncate block  text-xs font-dm-sans leading-none">
                            {currentTrack?.artists.map((a: any) => a.name).join(", ") || "-"}
                        </small>
                    </div>
                </div>

                {/* Play / pause */}
                <button
                    className="flex justify-center items-center p-1 rounded w-10 mx-auto cursor-pointer hover:bg-white/10"
                    onClick={handlePlay}
                >
                    {isPaused ? <FaPlay /> : <FaPause />}
                </button>

                <div className="flex w-full items-center gap-4 font-dm-sans pr-1">
                    {/* Progress */}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={sliderValue}
                        onChange={handleSliderChange}
                        onMouseUp={handleSliderCommit}
                        onTouchEnd={handleSliderCommit}
                        className="w-full h-1 accent-iplay-coral cursor-grab click:cursor-grabbing"
                    />
                    <small className="flex shrink-0 tabular-nums text-[0.625rem] w-15 justify-between">
                        <span className="min-w-6.5">{formatTime(positionMs)}</span>
                        <span className="opacity-60 font-bold">/</span>
                        <span className="min-w-6.5 text-right">{formatTime(durationMs)}</span>
                    </small>
                </div>
            </div>
        </div>
    );
}