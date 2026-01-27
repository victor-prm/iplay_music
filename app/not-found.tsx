import { FaLinkSlash } from "react-icons/fa6";

export default function NotFound() {
    return (
        <main className="min-h-screen grid place-items-center">
            <hgroup className="flex flex-col items-center gap-8">
                <FaLinkSlash className="size-24" />
                <h1 className="text-xl">404 – Page not found</h1>
            </hgroup>
        </main>
    );
}