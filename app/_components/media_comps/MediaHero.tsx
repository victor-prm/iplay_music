import Image from "next/image";
import type { ReactNode } from "react";
import type { MediaImage } from "@/types/components";

interface MediaHeroProps {
    /**
     * Images for the hero.
     * - Can be a single image or an array.
     * - First image: foreground
     * - Last image: blurred background
     */
    images?: MediaImage[] | MediaImage;
    title: string;

    /**
     * Content rendered next to the image
     */
    children: ReactNode;

    className?: string;
}

function MediaHeroImage({
    image,
    className,
}: {
    image: MediaImage;
    className?: string;
}) {
    const hasDimensions = Boolean(image.width && image.height);

    return (
        <Image
            src={image.url}
            alt={image.alt ?? ""}
            {...(hasDimensions
                ? { width: image.width, height: image.height }
                : { fill: true })}
            className={className}
            sizes="(max-width: 768px) 40vw, 18rem"
        />
    );
}

export default function MediaHero({
    images,
    title,
    children,
    className = "",
}: MediaHeroProps) {
    // Normalize images prop
    let imagesArray: MediaImage[] = [];
    if (images) imagesArray = Array.isArray(images) ? images : [images];

    if (imagesArray.length === 0) {
        return (
            <figure
                className={`
                flex gap-6
                bg-linear-to-r from-iplay-white/5 to-iplay-grape/5
                rounded-md p-6
                ${className}
                `}
            >
                <div className="flex flex-col gap-2 min-w-0">{children}</div>
            </figure>
        );
    }

    const foreground = imagesArray[0];
    const background = imagesArray[imagesArray.length - 1] ?? foreground;

    return (
        <figure
            className={`
            flex gap-6
            bg-linear-to-r from-iplay-white/5 to-iplay-grape/5
            rounded-md px-5 py-[clamp(1.25rem,5vw,2.5rem)]
            overflow-hidden items-end
            ${className}
            `}
        >
            <div
                className="
                relative
                aspect-square
                w-[clamp(6rem,20vw,18rem)]
                shrink-0
                grow-0
                grid
                "
            >
                {/* Blurred background */}
                <div className="absolute inset-0 -z-10">
                    <MediaHeroImage
                        image={background}
                        className="object-cover blur-[8vh] scale-110 w-full h-full aspect-square"
                    />
                </div>

                {/* Foreground image */}
                <div className="relative z-10 w-full h-full">
                    <MediaHeroImage
                        image={foreground}
                        className="object-cover rounded-lg border border-iplay-white/5 w-full h-full aspect-square"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 min-w-0">
                <h1 className="text-[clamp(1.5rem,4vw,4rem)] font-bold line-clamp-2 font-poppins">{title}</h1>
                {children}
            </div>
        </figure>
    );
}