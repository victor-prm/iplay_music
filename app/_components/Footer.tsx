export default function Footer() {
    const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl"
    return (
        <footer className={`h-12 z-10 fixed bg-linear-to-tr from-iplay-black/80 to-iplay-plum/80 p-2 bottom-0 w-full border-t border-iplay-grape/20 ${pseudoBlur}`}>
            <nav className="container mx-auto">
               
            </nav>
        </footer>
    )
}