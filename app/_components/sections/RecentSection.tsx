// app/_components/sections/RecentSection.tsx
import { fetchFromSpotify, getArtistsByName } from "@/app/_lib/dal";
import MediaGrid, { MediaGridItem } from "@/app/_components/MediaGrid";

export default async function RecentSection() {
  const data = await fetchFromSpotify(
    "https://api.spotify.com/v1/search?q=tag:new&type=album&limit=50&market=DK"
  ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

  const albums = data.albums?.items ?? [];

  const firstArtistNames = albums.map(a => a.artists[0].name);
  const artists = await getArtistsByName(firstArtistNames);
  const artistMap = Object.fromEntries(artists.map(a => [a.name, a]));

  let filteredAlbums = albums.filter(album => {
    if (album.album_type !== "album") return false;
    const artist = artistMap[album.artists[0].name];
    return artist?.popularity >= 60;
  });

  const dedupedMap: Record<string, SpotifyApi.AlbumObjectSimplified> = {};

  filteredAlbums.forEach(album => {
    const key = `${album.artists[0].name.toLowerCase()}-${album.name.toLowerCase()}`;
    const existing = dedupedMap[key];

    if (!existing || new Date(album.release_date) > new Date(existing.release_date)) {
      dedupedMap[key] = album;
    }
  });

  const items: MediaGridItem[] = Object.values(dedupedMap).map(album => ({
    id: album.id,
    title: album.name,
    images: album.images[0]
      ? [
          {
            url: album.images[0].url,
            width: album.images[0].width,
            height: album.images[0].height,
            alt: `Album cover for ${album.name}`,
          },
        ]
      : undefined,
    meta: album.artists.map(a => a.name).join(" • "),
    href: `/album/${album.id}`,
  }));

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">New Releases</h2>
      <MediaGrid items={items} variant="horizontal" />
    </section>
  );
}