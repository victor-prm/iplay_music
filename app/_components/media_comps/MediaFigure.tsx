"use client";

import Image from "next/image";
import { FaRegUser, FaCompactDisc, FaMusic } from "react-icons/fa";
import { useState, useEffect } from "react";
import type { MediaImage, UpToFour } from "@/types/components";

interface MediaFigureProps {
  images?: UpToFour<MediaImage>;
  fallbackType?: "artist" | "album" | "playlist";
  fallbackClassName?: string;
  fallbackIconClassName?: string;
  applyGrayscale?: boolean;
  onImagesLoaded?: () => void;
}

export default function MediaFigure({
  images,
  fallbackType = "artist",
  fallbackClassName = "",
  fallbackIconClassName = "text-white/40 text-3xl",
  applyGrayscale = false,
  onImagesLoaded,
}: MediaFigureProps) {
  if (!images || images.length === 0) {
    let Icon = FaRegUser;
    if (fallbackType === "album") Icon = FaCompactDisc;
    else if (fallbackType === "playlist") Icon = FaMusic;

    return (
      <div
        className={`grid place-items-center bg-iplay-plum border border-white/10 ${fallbackClassName} aspect-square`}
      >
        <Icon className={fallbackIconClassName} />
      </div>
    );
  }

  const [loaded, setLoaded] = useState<boolean[]>(
    new Array(images.length).fill(false)
  );

  const handleLoad = (index: number) => {
    setLoaded(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  // **Effect triggers parent callback only after render**
  useEffect(() => {
    if (onImagesLoaded && loaded.every(Boolean)) {
      onImagesLoaded();
    }
  }, [loaded, onImagesLoaded]);

  let gridColsClass = "";
  if (images.length === 2) gridColsClass = "grid-cols-2";
  else if (images.length === 3) gridColsClass = "grid-cols-3";
  else if (images.length === 4) gridColsClass = "grid-cols-2";

  return (
    <div className={`grid ${gridColsClass} gap-0.5`}>
      {images.map((img, i) => (
        <div
          key={i}
          className="relative w-full aspect-square overflow-hidden bg-iplay-black/20"
        >
          <Image
            src={img.url}
            alt={img.alt ?? ""}
            width={img.width ?? 512}
            height={img.height ?? 512}
            className={`object-cover w-full h-full transition-all duration-500 ease-out
              ${loaded[i] ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"}
              ${loaded[i] && applyGrayscale ? "grayscale" : ""}`}
            onLoad={() => handleLoad(i)}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}