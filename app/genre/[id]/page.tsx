// app/category/[id]/page.tsx
/// <reference types="spotify-api" />

import type { ArtistFull } from "@/types/spotify";
import { getArtistsByGenre } from "@/app/_lib/actions";
import { formatGenreQuery } from "@/app/_utils/helpers";
import ArtistItem from "@/app/_components/ArtistItem";

interface GenrePageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { id: genreSlug } = await params;
  if (!genreSlug) return <p>No genre selected.</p>;

  const artists: ArtistFull[] = await getArtistsByGenre(genreSlug, 10);
  if (!artists?.length) return <p>No artists found for this genre.</p>;

  console.log(artists);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="capitalize font-bold text-2xl">{formatGenreQuery(genreSlug)}</h1>
      <p>Showing {artists.length} result{artists.length > 1 ? "s" : ""}</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artists.map((artist, i) => (
          <li key={artist.id}>
            <ArtistItem artist={artist} href={`/artist/${artist.id}`} index={i}/>
          </li>
        ))}
      </ul>
    </div>
  );
}