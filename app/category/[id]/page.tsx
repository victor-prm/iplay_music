import { getArtistsByGenre } from "@/app/_lib/actions";
import Image from "next/image";

interface CategoryPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Unwrap params if it's a Promise
  const resolvedParams = await params;
  const genreSlug = resolvedParams.id;

  if (!genreSlug) {
    return <p>No genre selected.</p>;
  }

  // Fetch artists for the genre
  const artists = await getArtistsByGenre(genreSlug, 10);
  console.log(artists);

  return (
    <div>
      <h1 className="capitalize font-bold text-2xl">{genreSlug.replaceAll("_", " ")}</h1>

      {artists.length === 0 ? (<p>No artists found for this genre.</p>) : (
        <>
          <p>Showing {artists.length} result{artists.length > 1 ? "s" : ""}</p>
          <ul>
            {artists.map((artist) => (
              <li key={artist.id}>
                <strong>{artist.name}</strong> — Followers: {artist.followers.total} — Popularity: {artist.popularity}

                {artist.images?.[0] && (
                  <figure className="w-32 h-32">
                    <Image
                      src={artist.images[0].url}
                      alt={artist.name}
                      width={256}
                      height={256}
                      loading="eager"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}