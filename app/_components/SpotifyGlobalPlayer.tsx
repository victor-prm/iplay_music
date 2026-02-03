"use client";

import { useSpotifyPlayer } from "./SpotifyPlayerProvider";
import { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { RiReplay10Fill, RiForward10Fill } from "react-icons/ri";


import MediaFigure from "./media_comps/MediaFigure";

export default function SpotifyGlobalPlayer() {
    const { player, isPaused, togglePlay } = useSpotifyPlayer();

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

        // Fetch initial state (important if already playing)
        (async () => {
            const state = await (player as any).getCurrentState?.();
            if (state) handleStateChange(state);
        })();

        return () => {
            (player as any).removeListener?.(
                "player_state_changed",
                handleStateChange
            );
        };
    }, [player]);

    /* ──────────────────────────────────────────────
       2. Sync playback → slider (when not seeking)
       ────────────────────────────────────────────── */
    useEffect(() => {
        if (isSeeking || durationMs === 0) return;

        setSliderValue((positionMs / durationMs) * 100);
    }, [positionMs, durationMs, isSeeking]);

    /* ──────────────────────────────────────────────
       3. Smooth progress while playing
       ────────────────────────────────────────────── */
    useEffect(() => {
        if (isPaused || isSeeking || durationMs === 0) return;

        const interval = setInterval(() => {
            setSliderValue(prev =>
                Math.min(prev + (100 / (durationMs / 1000)), 100)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused, durationMs, isSeeking]);

    /* ──────────────────────────────────────────────
       Slider handlers
       ────────────────────────────────────────────── */
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
       Update Playback Position
       ────────────────────────────────────────────── */

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
            setPositionMs(
                Math.min(basePositionMs + elapsed, durationMs)
            );
        }, 500);

        return () => clearInterval(interval);
    }, [isPaused, basePositionMs, lastUpdateTs, durationMs]);

    useEffect(() => {
        if (!isPaused) return;
        setPositionMs(basePositionMs);
    }, [isPaused, basePositionMs]);

    if (!currentTrack) return null;

    const image = (currentTrack.album.images[currentTrack.album.images.length - 1]) ?? "";


    return (
        <div
            className="p-1.5 gap-8 fixed bottom-12 left-0 right-0 
             max-w-300 mx-auto
             bg-linear-to-tr from-iplay-coral/15 to-iplay-pink/15 text-white 
             z-50 backdrop-blur-md border border-iplay-coral/50 rounded-t-md"
        >
            <div className="mx-auto grid grid-cols-[1fr_0.5fr_1fr]">
                {/* Track info */}
                <div className="flex gap-1 min-w-0 justify-center items-center">
                    <div className="size-9 rounded-sm shrink-0 overflow-hidden border-2 border-iplay-coral/50">
                        <MediaFigure images={[image]} fillContainer />
                    </div>
                    <div className="overflow-hidden flex flex-col gap-1 justify-center">
                        <strong className="truncate block font-poppins text-xs leading-tight">
                            {currentTrack.name}
                        </strong>
                        <small className="opacity-70 truncate block  text-xs font-dm-sans leading-none">
                            {currentTrack.artists.map((a: any) => a.name).join(", ")}
                        </small>
                    </div>

                </div>
                {/* Play / pause */}
                <button
                    className="flex justify-center items-center p-1 rounded w-10 mx-auto cursor-pointer hover:bg-white/10"
                    onClick={togglePlay}
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