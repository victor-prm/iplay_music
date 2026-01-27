// app/genre-overview/page.tsx (Server Component)
import { myCategories } from "@/app/_data/static";
import { Suspense } from "react";
import MediaGrid from "@/app/_components/MediaGrid";
import MediaGridSkeleton from "@/app/_components/MediaGridSkeleton";

export default function GenreOverviewPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold font-poppins">Popular Genres</h1>

      <Suspense fallback={<MediaGridSkeleton count={myCategories.length} />}>
        <MediaGrid />
      </Suspense>
    </div>
  );
}