// app/_components/MediaGridSkeleton.tsx
import MediaCard from "./MediaCard";

type MediaGridVariant = "vertical" | "horizontal";

interface MediaGridSkeletonProps {
  count?: number;
  variant?: MediaGridVariant;
  showTitle?: boolean;
}

export default function MediaGridSkeleton({
  count = 8,
  showTitle = false,
  variant = "vertical",
}: {
  count?: number;
  showTitle?: boolean;
  variant?: "vertical" | "horizontal";
}) {
  const listClass =
    variant === "horizontal"
      ? "grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-4"
      : "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4";

  return (
    <div className="flex flex-col gap-4">
      {showTitle && (
        <div className="h-6 w-48 bg-iplay-white/10 rounded animate-pulse" />
      )}

      <ul className={listClass}>
        {Array.from({ length: count }).map((_, i) => (
          <li
            key={i}
            className={variant === "horizontal" ? "w-60 shrink-0" : ""}
          >
            <MediaCard loading />
          </li>
        ))}
      </ul>
    </div>
  );
}