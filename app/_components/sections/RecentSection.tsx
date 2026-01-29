"use client";

import { useEffect, useState } from "react";
import { fetchFromSpotify, getArtistsByName } from "@/app/_lib/dal";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import MediaSection from "@/app/_components/media_comps/MediaSection";
import type { UpToFour, MediaImage } from "@/types/components";

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

export default function RecentSection() {
  const [items, setItems] = useState<MediaGridItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const years = getSearchYears();
      const yearQuery = `year:${years.join("-")}`;

      const data = await fetchFromSpotify(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          yearQuery
        )}&type=album&limit=50&market=DK`
      ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

      const albums = data.albums?.items ?? [];
      const recentAlbums = albums.filter(
        album => album.album_type === "album" && isWithinLastMonths(album, 3)
      );

      if (!recentAlbums.length) return;

      // Deduplicate albums first
      const deduped: Record<string, SpotifyApi.AlbumObjectSimplified> = {};
      for (const album of recentAlbums) {
        const key = `${album.artists[0].name.toLowerCase()}-${album.name.toLowerCase()}`;
        const existing = deduped[key];
        if (!existing || new Date(album.release_date) > new Date(existing.release_date)) {
          deduped[key] = album;
        }
      }

      // Append each album individually
      for (const album of Object.values(deduped)) {
        const artistName = album.artists[0]?.name;
        if (!artistName) continue;

        // Fetch artist info individually
        const artistInfo = (await getArtistsByName([artistName]))[0];

        // Skip unpopular artists
        if (!artistInfo || artistInfo.popularity < 50) continue;

        const newItem: MediaGridItem = {
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
        };

        setItems(prev => [...prev, newItem]);
      }
    }

    fetchData();
  }, []);

  const placeholders: MediaGridItem[] = Array.from({ length: 8 }, (_, i) => ({
    id: `placeholder-${i}`,
    title: "",
    images: [] as UpToFour<MediaImage>,
    meta: null,
    href: "#",
    type: "album",
  }));

  return (
    <MediaSection title="Recent Popular Releases">
      <MediaGrid items={items.length ? items : placeholders} variant="horizontal" />
    </MediaSection>
  );
}