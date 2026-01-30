// app/_components/sections/FeaturedGenreSection.tsx
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { handpickedGenres } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { UpToFour, MediaImage } from "@/types/components";

const PLACEHOLDER_COUNT = 12;

// This will be a **server component**, not "use client"
export default async function FeaturedGenreSection() {
  const randomCategories = [...handpickedGenres]
    .sort(() => Math.random() - 0.5)
    .slice(0, PLACEHOLDER_COUNT);

  const TARGET_ARTISTS = 3;

  const results: (MediaGridItem | null)[] = await Promise.all(
    randomCategories.map(async (cat) => {
      const artists = await getArtistsByGenre(cat, TARGET_ARTISTS);
      const selected = artists.slice(0, TARGET_ARTISTS);
      if (!selected.length) return null;

      const images = selected
        .map((a) => a.images?.[0])
        .filter(Boolean)
        .slice(0, 4) as UpToFour<MediaImage>;

      return {
        id: cat,
        title: formatGenreQuery(cat),
        images,
        meta: (
          <span className="text-xs opacity-70 line-clamp-2">
            {selected.map((a) => a.name).join(" • ")}
            {artists.length > selected.length && (
              <span className="opacity-50"> etc.</span>
            )}
          </span>
        ),
        href: `/genre/${cat.replaceAll(" ", "_").toLowerCase()}`,
        type: "genre",
      } satisfies MediaGridItem;
    })
  );

  // Only keep non-null results
  const items: MediaGridItem[] = results.filter(Boolean) as MediaGridItem[];

  return (
    <MediaSection title="Discover genres" isLoading={false}>
      <MediaGrid items={items} loadingShape="wide" minLoadingMs={0} />
    </MediaSection>
  );
}

// ISR configuration (Next.js 13+ app router)
export const revalidate = 1800; // seconds = 10 minutes