"use client";

import Image from "next/image";
import { FaRegUser, FaCompactDisc, FaMusic } from "react-icons/fa";
import type { MediaImage, UpToFour } from "@/types/components";

interface MediaFigureProps {
  images?: UpToFour<MediaImage>;
  /**
   * Fallback type determines which icon to show if no images exist
   */
  fallbackType?: "artist" | "album" | "playlist";
  fallbackClassName?: string;
  fallbackIconClassName?: string;
}

/**
 * Component to render a single image or a grid of images
 * Falls back to a default icon if no images are provided
 */
export default function MediaFigure({
  images,
  fallbackType = "artist",
  fallbackClassName = "",
  fallbackIconClassName = "text-white/40 text-3xl",
}: MediaFigureProps) {
  /* ---------- Fallback ---------- */
  if (!images || images.length === 0) {
    let Icon;
    switch (fallbackType) {
      case "artist":
        Icon = FaRegUser;
        break;
      case "album":
        Icon = FaCompactDisc;
        break;
      case "playlist":
        Icon = FaMusic;
        break;
      default:
        Icon = FaRegUser;
    }

    return (
      <div
        className={`grid place-items-center bg-iplay-plum border border-white/10 ${fallbackClassName}`}
      >
        <Icon className={fallbackIconClassName} />
      </div>
    );
  }

  /* ---------- Images Grid ---------- */
  let gridColsClass = "";
  if (images.length === 2) gridColsClass = "grid-cols-2";
  else if (images.length === 3) gridColsClass = "grid-cols-3";
  else if (images.length === 4) gridColsClass = "grid-cols-2";

  return (
    <div className={`grid ${gridColsClass} gap-0.5`}>
      {images.map((img, i) => (
        <div key={i} className="relative w-full aspect-square">
          <Image
            src={img.url}
            alt={img.alt ?? ""}
            width={img.width ?? 512}
            height={img.height ?? 512}
            className="object-cover w-full h-full transition-transform duration-300 ease-out opacity-0 scale-95"
            onLoad={e => {
              // fade/scale-in animation on load
              const target = e.currentTarget;
              target.classList.remove("opacity-0", "scale-95");
              target.classList.add("opacity-100", "scale-100");
            }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}