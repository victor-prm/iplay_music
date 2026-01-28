// app/_components/MediaGridSkeleton.tsx
import MediaCard from "./MediaCard";

interface MediaGridSkeletonProps {
  count?: number;
  variant?: "vertical" | "horizontal";
}

export default function MediaGridSkeleton({ count = 8, variant = "vertical" }: MediaGridSkeletonProps) {
  const listClass =
    variant === "horizontal"
      ? "grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-4"
      : "grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4";

  return (
    <ul className={listClass}>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className={variant === "horizontal" ? "w-60 shrink-0" : ""}>
          <MediaCard loading={true} />
        </li>
      ))}
    </ul>
  );
}