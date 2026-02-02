
import { useSpotifyPlayer } from "./SpotifyPlayerProvider";
import { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";



export default function SpotifyGlobalPlayer() {
  const { player, currentTrackId, isPaused, togglePlay } = useSpotifyPlayer();
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [nextTracks, setNextTracks] = useState<any[]>([]);

  useEffect(() => {
    if (!player) return;

    const handleStateChange = (state: any) => {
      if (!state) return;
      setCurrentTrack(state.track_window.current_track);
      setNextTracks(state.track_window.next_tracks);
      console.log("Queue:", state.track_window.next_tracks);
    };

    player.addListener("player_state_changed", handleStateChange);

    // Optional: poll for initial state if track already playing
    (async () => {
      try {
        const state = await (player as any).getCurrentState?.();
        if (state) handleStateChange(state);
      } catch (err) {
        console.error("Failed to get initial state:", err);
      }
    })();

    return () => {
      (player as any).removeListener?.("player_state_changed", handleStateChange);
    };
  }, [player, currentTrackId]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-11.5 left-0 right-0 bg-iplay-coral/50 text-white p-3 flex justify-between items-center shadow-lg z-50 backdrop-blur-xs border border-iplay-coral rounded-t-md">
      <div>
        <strong>{currentTrack.name}</strong> —{" "}
        {currentTrack.artists.map((a: any) => a.name).join(", ")}
      </div>
      <button
        className="ml-4 p-2 rounded hover:bg-gray-700"
        onClick={togglePlay}
      >
        {isPaused ? <FaPlay /> : <FaPause />}
      </button>
    </div>
  );
}