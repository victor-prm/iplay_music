import Image from "next/image";
import type { IconType } from "react-icons";
import type { MediaImage, UpToFour } from "@/types/components";

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

export default function MediaFigure({
  images,
  fallbackIcon: FallbackIcon,
  fallbackClassName = "",
  fallbackIconClassName = "",
}: MediaFigureProps) {
  /* ---------- Fallback ---------- */
  if (!images || images.length === 0) {
    if (!FallbackIcon) return null;

    return (
      <div
        className={`grid place-items-center bg-iplay-plum border border-white/10 ${fallbackClassName}`}
      >
        <FallbackIcon className={fallbackIconClassName} />
      </div>
    );
  }

  /* ---------- Images ---------- */
  let gridColsClass = "";

  if (images.length === 2) gridColsClass = "grid-cols-2";
  else if (images.length === 3) gridColsClass = "grid-cols-3";
  else if (images.length === 4) gridColsClass = "grid-cols-2";

  return (
    <div className={`grid ${gridColsClass} gap-0.5`}>
      {images.map((img, i) => (
        <div key={i} className="relative w-full aspect-square">
          <ImageItem img={img} />
        </div>
      ))}
    </div>
  );
}