// app/_components/sections/RecentSection.tsx
import { fetchFromSpotify, getArtistsByName } from "@/app/_lib/dal";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";

function getSearchYears(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  return month < 3 ? [year - 1, year] : [year];
}

function isWithinLastMonths(
  album: SpotifyApi.AlbumObjectSimplified,
  monthsBack: number,
  now = new Date()
) {
  if (!album.release_date || album.release_date_precision === "year") return false;
  const releaseDate = new Date(album.release_date);
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - monthsBack);
  return releaseDate >= cutoff;
}

export default async function RecentSection() {
  const years = getSearchYears();
  const yearQuery = "year:" + years.join("-");

  const data = await fetchFromSpotify(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      yearQuery
    )}&type=album&limit=50&market=DK`
  ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

  const albums = data.albums?.items ?? [];

  const recentAlbums = albums.filter(album =>
    album.album_type === "album" &&
    isWithinLastMonths(album, 3) // last 3 months
  );

  const firstArtistNames = recentAlbums.map(a => a.artists[0].name);
  const artists = await getArtistsByName(firstArtistNames);
  const artistMap = Object.fromEntries(artists.map(a => [a.name, a]));

  const popularAlbums = recentAlbums.filter(album => {
    const artist = artistMap[album.artists[0].name];
    return artist?.popularity >= 100;
  });

  const dedupedMap: Record<string, SpotifyApi.AlbumObjectSimplified> = {};
  popularAlbums.forEach(album => {
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
      ? [{
          url: album.images[0].url,
          width: album.images[0].width,
          height: album.images[0].height,
          alt: `Album cover for ${album.name}`,
        }]
      : undefined,
    meta: album.artists.map(a => a.name).join(" • "),
    href: `/album/${album.id}`,
  }));

  if (!items.length) return null;

  return <MediaGrid items={items} variant="horizontal" />;
}