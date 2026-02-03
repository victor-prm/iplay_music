import { GrHomeRounded } from "react-icons/gr";
import { GrTarget } from "react-icons/gr";
import { GrCatalog } from "react-icons/gr";
import Link from "next/link";



export default function Footer() {
    const pseudoBlur = "before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl"
    return (
        <footer className={`h-auto z-100 fixed bg-linear-to-tr from-iplay-black/80 to-iplay-plum/80 p-2 bottom-0 w-full border-t border-iplay-grape/20 ${pseudoBlur}`}>
            <nav className="container mx-auto max-w-300 grid grid-cols-[1fr_1fr_1fr]">
                <Link href="/" className="flex flex-col items-center rounded cursor-pointer">
                    <GrHomeRounded className="size-5"/>
                    <small className="text-[0.625rem]">Home</small>
                </Link>
                <Link href="/" className="flex flex-col items-center rounded cursor-pointer">
                    <GrTarget className="size-5"/>
                    <small className="text-[0.625rem]">Player</small>
                </Link>
                <Link href="/genres" className="flex flex-col items-center rounded cursor-pointer">
                    <GrCatalog className="size-5"/>
                    <small className="text-[0.625rem]">Genres</small>
                </Link>
            </nav>
        </footer>
    )
}