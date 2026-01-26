// app/genre-overview/GenreFeed.tsx
import MediaCard from "@/app/_components/MediaCard";
import { getArtistsByGenre } from "../_lib/dal";
import { myCategories } from "../_data/static";

export default async function MediaGrid() {
  const genrePreviews = await Promise.all(
    myCategories.map(async (cat) => {
      const artists = await getArtistsByGenre(cat, 4);
      return {
        name: cat,
        artists: artists.map(a => a.name),
        thumbnails: artists
          .map(a => a.images?.[1])
          .filter(img => !!img),
      };
    })
  );

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
      {genrePreviews.map(genre => (
        <li key={genre.name}>
          <MediaCard
            images={genre.thumbnails}
            title={genre.name}
            meta={
              <span className="text-xs opacity-70 line-clamp-2">
                {genre.artists.join(" • ")}
                <span className="opacity-50"> etc.</span>
              </span>
            }
            href={`/genre/${genre.name.replaceAll(" ", "_").toLocaleLowerCase()}`}
          />
        </li>
      ))}
    </ul>
  );
}