import MediaCard from "@/app/_components/MediaCard";

export default function MediaGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <MediaCard loading />
        </li>
      ))}
    </ul>
  );
}