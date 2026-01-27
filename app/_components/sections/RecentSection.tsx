import { fetchFromSpotify, getArtistsByName } from "@/app/_lib/dal";
import MediaCard from "@/app/_components/MediaCard";

interface NewReleasesResponse {
  albums?: {
    items: SpotifyApi.AlbumObjectSimplified[];
  };
}

export default async function RecentSection() {
  // 1️⃣ Fetch new releases
  const data = (await fetchFromSpotify(
    "https://api.spotify.com/v1/search?q=tag:new&type=album&limit=50&market=DK"
  )) as NewReleasesResponse;

  const albums = data.albums?.items ?? [];

  // 2️⃣ Fetch first artist popularity
  const firstArtistNames = albums.map(a => a.artists[0].name);
  const artists = await getArtistsByName(firstArtistNames);
  const artistMap = Object.fromEntries(artists.map(a => [a.name, a]));

  // 3️⃣ Filter albums: full album + artist popularity >= threshold
  let filteredAlbums = albums.filter(album => {
    if (album.album_type !== "album") return false;
    const artist = artistMap[album.artists[0].name];
    if (!artist) return false;
    return artist.popularity >= 80;
  });

  // 4️⃣ Deduplicate by artist + album name, keep newest release_date
  const dedupedMap: Record<string, SpotifyApi.AlbumObjectSimplified> = {};

  filteredAlbums.forEach(album => {
    const key = `${album.artists[0].name.toLowerCase()}-${album.name.toLowerCase()}`;
    const existing = dedupedMap[key];

    if (!existing) {
      dedupedMap[key] = album;
    } else {
      // Compare release dates
      const existingDate = new Date(existing.release_date);
      const currentDate = new Date(album.release_date);

      if (currentDate > existingDate) {
        dedupedMap[key] = album;
      }
    }
  });

  filteredAlbums = Object.values(dedupedMap);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New Releases</h1>

      <ul className="grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-4">
        {filteredAlbums.map(album => (
          <li key={album.id}>
            <MediaCard
              href={`/album/${album.id}`}
              title={album.name}
              images={[
                {
                  url: album.images[0].url,
                  width: album.images[0].width,
                  height: album.images[0].height,
                  alt: `Album cover for ${album.name}`,
                },
              ]}
              meta={album.artists.map(a => a.name).join(" • ")}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}