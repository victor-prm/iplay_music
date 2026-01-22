// app/artists/page.tsx
import type { ArtistFull } from "@/types/spotify";
import { getArtistsByName } from "../_lib/dal";
import { names1990s } from "../_data/static";
import ArtistItem from "@/app/_components/ArtistItem";

export default async function CategoryPage() {
  const decadeArtists: string[] = names1990s;
  const artists: ArtistFull[] = await getArtistsByName(decadeArtists);
  console.log(artists)

  return (
    <div className="flex flex-col gap-4">
      <h1>Artists of the decade</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <li key={artist.id}>
            <ArtistItem artist={artist} />
          </li>
        ))}
      </ul>
    </div>
  );
}