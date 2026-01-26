import SearchBar from "./SearchBar"

export default function Header() {
     const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl"
    return (
        <header className={`h-12 z-10 fixed bg-linear-to-tr from-iplay-black/80 to-iplay-plum/80 p-2 top-0 w-full border-b border-iplay-grape/20 ${pseudoBlur}`}>
            <nav className="flex h-full items-center container mx-auto">
                <SearchBar />
            </nav>
        </header>
    )
}