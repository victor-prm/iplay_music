"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function BackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        // Disable back button on front page, otherwise enable if history exists
        setCanGoBack(pathname !== "/" && window.history.length > 1);
    }, [pathname]);

    return (
        <button
            onClick={() => router.back()}
            style={{
                visibility: canGoBack ? "visible" : "hidden",
                pointerEvents: canGoBack ? "auto" : "none",
            }}
            className="p-2 rounded cursor-pointer"
        >
            <FaChevronLeft />
        </button>
    );
}