// app/page.tsx
import MediaSection from "@/app/_components/media_comps/MediaSection";
import GenreSection from "@/app/_components/sections/GenreSection";
import RecentSection from "@/app/_components/sections/RecentSection";

export default async function Home() {
  return (
    <>
      <MediaSection title="Browse genres">
        <GenreSection />
      </MediaSection>

      <MediaSection title="Recent Popular Releases" variant="horizontal">
        <RecentSection />
      </MediaSection>
    </>
  );
}