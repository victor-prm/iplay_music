// app/page.tsx
import { Suspense } from "react";
import RecentSection from "@/app/_components/sections/RecentSection";
import GenreSection from "@/app/_components/sections/GenreSection";
import MediaGridSkeleton from "@/app/_components/MediaGridSkeleton";

export default function Home() {
  return (
    <>
      <Suspense fallback={<MediaGridSkeleton count={6} />}>
        <GenreSection />
      </Suspense>

      <Suspense fallback={<MediaGridSkeleton count={8} />}>
        <RecentSection />
      </Suspense>
    </>
  );
}