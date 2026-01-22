import Image from "next/image";
import { FaMusic } from "react-icons/fa";
import type { MediaImage } from "@/types/media";

interface MediaFigureProps {
  images?: MediaImage[];
}

export function MediaFigure({ images }: MediaFigureProps) {
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <FaMusic className="size-[33%] text-iplay-grape/50" />
      </div>
    );
  }

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