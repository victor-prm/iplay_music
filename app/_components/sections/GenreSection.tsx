import MediaGrid, { MediaGridItem } from "@/app/_components/MediaGrid";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { myCategories } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";

export default async function GenreSection() {
  // 1️⃣ Pick 6 random categories
  const randomCategories = [...myCategories]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  // 2️⃣ Fetch data
  const genrePreviews: MediaGridItem[] = await Promise.all(
    randomCategories.map(async (cat) => {
      const artists = await getArtistsByGenre(cat, 4);

      return {
        id: cat,
        title: formatGenreQuery(cat),
        images: artists.map(a => a.images?.[1]).filter(Boolean),
        meta: (
          <span className="text-xs opacity-70 line-clamp-2">
            {artists.map(a => a.name).join(" • ")}
            <span className="opacity-50"> etc.</span>
          </span>
        ),
        href: `/genre/${cat.replaceAll(" ", "_").toLowerCase()}`,
      };
    })
  );

  // 3️⃣ Render section
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Browse genres</h2>
      <MediaGrid items={genrePreviews} />
    </section>
  );
}