import MediaCard from "@/app/_components/MediaCard";
import type { MediaImage } from "@/types/components";

export interface MediaGridItem {
  id: string | number;
  title: string;
  images?: MediaImage[];
  meta?: React.ReactNode;
  href?: string;
}

interface MediaGridProps {
  items: MediaGridItem[];
  skeletonCount?: number;
}

export default function MediaGrid({ items, skeletonCount = 8 }: MediaGridProps) {
  if (!items.length) {
    return (
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <li key={i}>
            <MediaCard loading />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
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