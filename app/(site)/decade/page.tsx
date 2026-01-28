// app/artists/page.tsx
import type { ArtistFull } from "@/types/spotify";
import { getArtistsByName } from "@/app/_lib/dal";
import { names1990s } from "@/app/_data/static";
import MediaCard from "@/app/_components/media_comps/MediaCard";
import PopularityMeter from "@/app/_components/PopularityMeter";
import { abbreviateNumber } from "@/app/_utils/helpers";

export default async function CategoryPage() {
  const decadeArtists: string[] = names1990s;
  const artists: ArtistFull[] = await getArtistsByName(decadeArtists);

  return (
    <div className="flex flex-col gap-4">
      <h1>Artists of the decade</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <li key={artist.id}>
            <MediaCard
              href={`/artist/${artist.id}`}
              title={artist.name}
              images={
                artist.images?.length
                  ? [
                      {
                        url: artist.images[0].url,
                        width: artist.images[0].width,
                        height: artist.images[0].height,
                        alt: `Artist image of ${artist.name}`,
                      },
                    ]
                  : undefined
              }
              meta={
                <>
                  {abbreviateNumber(artist.followers?.total) ?? 0} followers
                  <PopularityMeter value={artist.popularity} />
                </>
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}