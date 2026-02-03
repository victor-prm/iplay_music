"use client";

import { GrHomeRounded, GrTarget, GrCatalog } from "react-icons/gr";
import Link from "next/link";
import { useSpotifyPlayer } from "./SpotifyPlayerProvider";

export default function Footer() {
  const { isPlayerVisible, setIsPlayerVisible } = useSpotifyPlayer();

  const togglePlayer = () => setIsPlayerVisible(v => !v);

  const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl";

  return (
    <footer className={`h-auto z-100 fixed bg-linear-to-tr from-iplay-black/80 to-iplay-plum/80 p-2 bottom-0 w-full border-t border-iplay-grape/20 ${pseudoBlur}`}>
      <nav className="container mx-auto max-w-300 grid grid-cols-[1fr_1fr_1fr]">
        <Link href="/" className="flex flex-col items-center rounded cursor-pointer">
          <GrHomeRounded className="size-5"/>
          <small className="text-[0.625rem]">Home</small>
        </Link>

        {/* Player toggle */}
        <button
          className={`flex flex-col items-center rounded cursor-pointer ${isPlayerVisible ? "text-iplay-coral" : ""}`}
          onClick={togglePlayer}
        >
          <GrTarget className="size-5"/>
          <small className="text-[0.625rem]">Player</small>
        </button>

        <Link href="/genres" className="flex flex-col items-center rounded cursor-pointer">
          <GrCatalog className="size-5"/>
          <small className="text-[0.625rem]">Genres</small>
        </Link>
      </nav>
    </footer>
  );
}