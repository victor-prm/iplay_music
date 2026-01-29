// app/_components/RecentSection.tsx
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import MediaSection from "@/app/_components/media_comps/MediaSection";
import type { UpToFour, MediaImage } from "@/types/components";
import { getArtistsByName, fetchFromSpotify } from "@/app/_lib/dal";

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

// Server component with caching
export default async function RecentSection() {
  const years = getSearchYears();
  const yearQuery = `year:${years.join("-")}`;

  const data = await fetchFromSpotify(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      yearQuery
    )}&type=album&limit=50&market=DK`,
    { revalidate: 1800 }  // cache for half an hour
  ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

  const albums = data.albums?.items ?? [];
  const recentAlbums = albums.filter(
    album => album.album_type === "album" && isWithinLastMonths(album, 3)
  );

  // Deduplicate albums
  const deduped: Record<string, SpotifyApi.AlbumObjectSimplified> = {};
  for (const album of recentAlbums) {
    const key = `${album.artists[0].name.toLowerCase()}-${album.name.toLowerCase()}`;
    const existing = deduped[key];
    if (!existing || new Date(album.release_date) > new Date(existing.release_date)) {
      deduped[key] = album;
    }
  }

  const dedupedAlbums = Object.values(deduped);

  // Fetch artist info in batch
  const artistNames = dedupedAlbums.map(a => a.artists[0]?.name).filter(Boolean);
  const artists = await getArtistsByName(artistNames);
  const artistMap = Object.fromEntries(artists.map(a => [a.name, a]));

  // Map to MediaGridItem
  const items: MediaGridItem[] = dedupedAlbums
    .filter(album => {
      const artist = artistMap[album.artists[0].name];
      return artist?.popularity >= 50;
    })
    .map(album => ({
      id: album.id,
      title: album.name,
      href: `/album/${album.id}`,
      type: "album",
      meta: album.artists.map(a => a.name).join(" • "),
      images: album.images?.[0]
        ? ([{
          url: album.images[0].url,
          width: album.images[0].width,
          height: album.images[0].height,
          alt: `Album cover for ${album.name}`,
        }] as UpToFour<MediaImage>)
        : [],
    }));

  const placeholders: MediaGridItem[] = Array.from({ length: 8 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: "",
    images: [] as UpToFour<MediaImage>,
    meta: null,
    href: "#",
    type: "album",
  }));

  return (
    <MediaSection title="Recent Popular Releases" isLoading={items.length === 0}>
      <MediaGrid items={items.length ? items : placeholders} variant="horizontal" />
    </MediaSection>
  );
}