// app/_components/MediaGrid.tsx
import MediaCard from "./MediaCard";
import type { MediaImage } from "@/types/components";
import { UpToFour } from "@/types/components";

export interface MediaGridItem {
  id: string | number;
  title: string;
  images?: UpToFour<MediaImage>;
  meta?: React.ReactNode;
  href?: string;
  type?: string;
}

type MediaGridVariant = "vertical" | "horizontal";

interface MediaGridProps {
  items: MediaGridItem[];
  variant?: MediaGridVariant;
  title?: string;
  titleClassName?: string;
  loadingShape?: "square" | "wide" | "tall"; // NEW
}

export default function MediaGrid({
  items,
  variant = "vertical",
  loadingShape = "square",
}: MediaGridProps) {
  if (!items.length) return null;

  const listClass =
    variant === "horizontal"
      ? "grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
      : "grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4";

  return (
    <ul className={`${listClass} auto-rows-fr`}>
      {items.map(item => (
        <li
          key={item.id}
          className={`h-full ${variant === "horizontal" ? "snap-center" : ""}`}
        >
          <MediaCard {...item} loadingShape={loadingShape} />
        </li>
      ))}
    </ul>
  );
}