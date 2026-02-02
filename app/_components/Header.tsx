"use client"

import SearchBar from "./search/SearchBar";
import HeaderTitle from "./HeaderTitle";
import BackButton from "./BackButton";

export default function Header() {
    const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl"

    return (
        <header className={`h-auto z-100 fixed bg-linear-to-tr from-iplay-black/80 to-iplay-plum/80 p-2 top-0 w-full border-b border-iplay-grape/20 ${pseudoBlur}`}>
            <nav className="relative flex h-full items-center justify-between container mx-auto max-w-300">
                <BackButton />
                <HeaderTitle />
                <SearchBar />
            </nav>
        </header>
    )
}