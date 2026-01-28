// app/_components/sections/GenreSection.tsx
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { myCategories } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";

export default async function GenreSection() {
  // Pick 6 random categories
  const randomCategories = [...myCategories].sort(() => Math.random() - 0.5).slice(0, 12);

  // Fetch genre data
  const genrePreviews: MediaGridItem[] = (
    await Promise.all(
      randomCategories.map(async (cat) => {
        const artists = await getArtistsByGenre(cat, 10);
        const filteredArtists = artists.filter(a => a.popularity >= 50);
        if (!filteredArtists.length) return null;

        return {
          id: cat,
          title: formatGenreQuery(cat),
          images: filteredArtists.map(a => a.images?.[1]).filter(Boolean),
          meta: (
            <span className="text-xs opacity-70 line-clamp-2">
              {filteredArtists.map(a => a.name).join(" • ")}
              <span className="opacity-50"> etc.</span>
            </span>
          ),
          href: `/genre/${cat.replaceAll(" ", "_").toLowerCase()}`,
          type: "genre"
        } as MediaGridItem;
      })
    )
  ).filter(Boolean) as MediaGridItem[];

  genrePreviews.slice(0, 4)

  // Hide entire section if no items
  if (!genrePreviews.length) return null;

  return (
    <MediaSection title="Browse genres">
      <MediaGrid items={genrePreviews} />
    </MediaSection>
  );
}