/// <reference types="spotify-api" />

import { fetchFromSpotify } from "@/app/_lib/dal";
import AlbumItem from "@/app/_components/AlbumItem";

interface NewReleasesResponse {
  albums?: {
    items: SpotifyApi.AlbumObjectSimplified[];
  };
}

export default async function NewReleasePage() {
  const data = (await fetchFromSpotify(
    "https://api.spotify.com/v1/browse/new-releases?country=DK&limit=20"
  )) as NewReleasesResponse;

  const albums = data.albums?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New Releases</h1>

      <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {albums.map((album) => (
          <li key={album.id}>
            <AlbumItem
              album={album}
              href={`/album/${album.id}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}