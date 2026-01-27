"use client"

import { usePathname } from 'next/navigation'

export default function HeaderTitle() {
    const pageTitle = usePathname().split("/")[1].trim() || "Home";


    return (
        <h1 className="absolute left-0 right-0 mx-auto w-fit font-dm-sans font-bold first-letter:uppercase">{pageTitle}</h1>
    )
}