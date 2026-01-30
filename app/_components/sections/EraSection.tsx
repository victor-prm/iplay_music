// app/_components/EraSection.tsx
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import { fetchFromSpotify } from "@/app/_lib/dal";
import type { UpToFour, MediaImage } from "@/types/components";

const ERAS = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950]
const TARGET_ARTISTS_PER_ERA = 3;

export default async function EraSection() {
  const items: MediaGridItem[] = [];

  await Promise.all(
    ERAS.map(async (startYear) => {
      const endYear = startYear + 9;
      let data: { albums?: { items?: SpotifyApi.AlbumObjectSimplified[] } } | null = null;

      try {
        data = await fetchFromSpotify(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            `year:${startYear}-${endYear}`
          )}&type=album&limit=50&market=DK`,
          { revalidate: 1800 } // cache for half an hour
        );
      } catch (err) {
        console.error(`Spotify fetch failed for era ${startYear}s`, err);
        return;
      }

      const albums = data?.albums?.items ?? [];
      if (!albums.length) return;

      const artistMap = new Map<string, { name: string; image?: MediaImage }>();

      for (const album of albums) {
        const artist = album.artists?.[0];
        if (!artist || artistMap.has(artist.id)) continue;

        const img = album.images?.[0];
        artistMap.set(artist.id, {
          name: artist.name,
          image: img
            ? { url: img.url, width: img.width, height: img.height, alt: `${artist.name} image` }
            : undefined,
        });
      }

      const selected = Array.from(artistMap.values()).slice(0, TARGET_ARTISTS_PER_ERA);
      if (!selected.length) return;

      const images = selected.map(a => a.image).filter(Boolean) as UpToFour<MediaImage>;

      items.push({
        id: String(startYear),
        title: `${startYear}s`,
        href: `/era/${startYear}`,
        type: "era",
        images,
        meta: (
          <span className="text-xs opacity-70 line-clamp-2">
            {selected.map(a => a.name).join(" • ")}
            {artistMap.size > selected.length && <span className="opacity-50"> etc.</span>}
          </span>
        ),
      });
    })
  );

  const placeholders: MediaGridItem[] = Array.from({ length: 12 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: "",
    images: [] as UpToFour<MediaImage>,
    meta: null,
    href: "#",
    type: "era",
  }));

  return (
    <MediaSection title="Browse by era" isLoading={items.length === 0}>
      <MediaGrid
        items={items.length ? items : placeholders}
        loadingShape="wide"
      />
    </MediaSection>
  );
}