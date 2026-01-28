import Image from "next/image";
import { FaMusic } from "react-icons/fa";
import type { IconType } from "react-icons";
import type { MediaImage } from "@/types/components";

interface MediaFigureProps {
  images?: MediaImage[];

  /** Fallback customization */
  fallbackIcon?: IconType;
  fallbackClassName?: string;
  fallbackIconClassName?: string;
}

export default function MediaFigure({
  images,
  fallbackIcon: FallbackIcon = FaMusic,
  fallbackClassName = "",
  fallbackIconClassName = "",
}: MediaFigureProps) {
  /* ---------- Fallback ---------- */
  if (!images || images.length === 0) {
    return (
      <figure
        className={`
          size-10 aspect-square grid place-items-center
          rounded-sm border border-white/10 bg-iplay-plum
          ${fallbackClassName}
        `}
      >
        <FallbackIcon
          className={`size-[50%] text-iplay-pink/33 ${fallbackIconClassName}`}
        />
      </figure>
    );
  }

  /* ---------- Single image ---------- */
  if (images.length === 1) {
    const img = images[0];
    return (
      <Image
        src={img.url}
        alt={img.alt ?? ""}
        width={img.width ?? 512}
        height={img.height ?? 512}
        className="object-cover w-full h-full"
        loading="lazy"
      />
    );
  }

  /* ---------- Image grid ---------- */
  return (
    <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
      {images.slice(0, 4).map((img, i) => (
        <Image
          key={i}
          src={img.url}
          alt={img.alt ?? ""}
          width={img.width ?? 256}
          height={img.height ?? 256}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      ))}
    </div>
  );
}