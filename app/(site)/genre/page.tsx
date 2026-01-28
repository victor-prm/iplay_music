import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { myCategories } from "@/app/_data/static";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { UpToFour, MediaImage } from "@/types/components";

export default async function GenreFeed() {
  const genrePreviews: MediaGridItem[] = await Promise.all(
    myCategories.map(async cat => {
      const artists = await getArtistsByGenre(cat, 4);

      // Convert images to UpToFour<MediaImage>
      const images: UpToFour<MediaImage> = (artists
        .map(a => a.images?.[1])
        .filter(Boolean)
        .slice(0, 4)
        .map(img => ({
          url: img!.url,
          width: img!.width,
          height: img!.height,
          alt: img!.height ? `${cat} image` : "",
        })) || []) as UpToFour<MediaImage>;

      return {
        id: cat,
        title: formatGenreQuery(cat),
        images,
        meta: (
          <span className="text-xs opacity-70 line-clamp-2">
            {artists.map(a => a.name).join(" • ")}
            <span className="opacity-50"> etc.</span>
          </span>
        ),
        href: `/genre/${cat.replaceAll(" ", "_").toLowerCase()}`,
        type: "genre",
      };
    })
  );

  return <MediaGrid items={genrePreviews} />;
}