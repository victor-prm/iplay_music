import Image from "next/image";
import { UpToFour } from "@/types/components";
import type { IconType } from "react-icons";
import type { MediaImage } from "@/types/components";

interface MediaFigureProps {
  images?: UpToFour<MediaImage>;
  fallbackIcon?: IconType;
  fallbackClassName?: string;
  fallbackIconClassName?: string;
}

function ImageItem({ img }: { img: MediaImage }) {
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

export default function MediaFigure({ images }: MediaFigureProps) {
  if (!images?.length) return null;

  const displayImages = images.slice(0, 4);
  const extraCount = images.length - displayImages.length;

  let gridColsClass = "";

  if (displayImages.length === 2) gridColsClass = "grid-cols-2";
  else if (displayImages.length === 3) gridColsClass = "grid-cols-3";
  else if (displayImages.length >= 4) gridColsClass = "grid-cols-2";

  return (
    <div className={`grid ${gridColsClass} gap-0.5`}>
      {displayImages.map((img, i) => (
        <div key={i} className="relative w-full aspect-square">
          <ImageItem img={img} />

          {i === displayImages.length - 1 && extraCount > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg">
              +{extraCount}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}