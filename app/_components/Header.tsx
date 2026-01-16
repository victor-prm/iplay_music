import SearchBar from "./SearchBar"

export default function Header() {
     const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl"
    return (
        <header className={`h-10 z-10 fixed bg-iplay-plum/33 p-2 top-0 w-full ${pseudoBlur}`}>
            <nav className="flex h-full items-center container mx-auto">
                <SearchBar />
            </nav>
        </header>
    )
}