export default function Footer() {
    const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl"
    return (
        <footer className={`h-10 z-10 fixed bg-iplay-plum/33 p-2 bottom-0 w-full ${pseudoBlur}`}>
            <nav className="container mx-auto">
                Footer
            </nav>
        </footer>
    )
}