// app/_components/MediaGrid.tsx
import MediaCard from "@/app/_components/MediaCard";
import type { MediaImage } from "@/types/components";

export interface MediaGridItem {
  id: string | number;
  title: string;
  images?: MediaImage[];
  meta?: React.ReactNode;
  href?: string;
}

type MediaGridVariant = "vertical" | "horizontal";

interface MediaGridProps {
  items: MediaGridItem[];
  variant?: MediaGridVariant;
}

export default function MediaGrid({
  items,
  variant = "vertical",
}: MediaGridProps) {
  if (!items.length) return null;

  const listClass =
    variant === "horizontal"
      ? "grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-4"
      : "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4";

  return (
    <ul className={listClass}>
      {items.map(item => (
        <li key={item.id}>
          <MediaCard
            title={item.title}
            images={item.images}
            meta={item.meta}
            href={item.href}
          />
        </li>
      ))}
    </ul>
  );
}