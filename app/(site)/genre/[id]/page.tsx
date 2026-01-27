/// <reference types="spotify-api" />

import type { ArtistFull } from "@/types/spotify";
import { getArtistsByGenre } from "@/app/_lib/dal";
import { formatGenreQuery } from "@/app/_utils/helpers";
import PopularityMeter from "@/app/_components/PopularityMeter";
import { abbreviateNumber } from "@/app/_utils/helpers";
import MediaCard from "@/app/_components/MediaCard";

interface GenrePageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { id: genreSlug } = await params;
  if (!genreSlug) return <p>No genre selected.</p>;

  const artists: ArtistFull[] = await getArtistsByGenre(genreSlug, 10);
  if (!artists?.length) return <p>No artists found for this genre.</p>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="capitalize font-bold text-2xl">{formatGenreQuery(genreSlug)}</h1>
      <p>
        Showing {artists.length} result{artists.length > 1 ? "s" : ""}
      </p>

      <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
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