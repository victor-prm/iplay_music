// app/category/[id]/page.tsx
/// <reference types="spotify-api" />

import Image from "next/image";
import { getArtistsByGenre } from "@/app/_lib/actions";
import { formatGenreQuery } from "@/app/_utils/helpers";
import type { ArtistFull } from "@/types/spotify";
import Link from "next/link";

interface GenrePageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
  // Unwrap params if it's a Promise (Next 16 App Router)
  const { id: genreSlug } = await params;

  if (!genreSlug) {
    return <p>No genre selected.</p>;
  }

  // Fetch artists for the genre
  const artists: ArtistFull[] = await getArtistsByGenre(genreSlug, 10);

  if (!artists || artists.length === 0) {
    return <p>No artists found for this genre.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="capitalize font-bold text-2xl">{formatGenreQuery(genreSlug)}</h1>
      <p>Showing {artists.length} result{artists.length > 1 ? "s" : ""}</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <li key={artist.id} className="flex flex-col gap-2 border rounded-md p-2">
            <Link href={`/artist/${artist.id}`}>
              {/* Artist Image */}
              {artist.images?.[0] && (
                <figure className="w-full aspect-square overflow-hidden rounded-md">
                  <Image
                    src={artist.images[0].url}
                    alt={`Artist image of ${artist.name}`}
                    width={artist.images[0].width}
                    height={artist.images[0].height}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </figure>
              )}

              {/* Artist Info */}
              <div className="flex flex-col gap-1">
                <strong className="text-lg">{artist.name}</strong>
                <span className="text-sm opacity-70">
                  Followers: {artist.followers?.total ?? 0} • Popularity: {artist.popularity ?? 0}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}