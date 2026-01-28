"use client";

import { useEffect, useState } from "react";
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import MediaGridSkeleton from "../media_comps/MediaGridSkeleton";
import { fetchFromSpotify } from "@/app/_lib/dal";
import type { UpToFour, MediaImage } from "@/types/components";

export default function EraSection() {
  const [items, setItems] = useState<(MediaGridItem | null)[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const eras = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
      const targetArtistsPerEra = 3;

      const eraPreviews: (MediaGridItem | null)[] = Array(eras.length).fill(null);

      for (let i = 0; i < eras.length; i++) {
        const startYear = eras[i];
        const endYear = startYear + 9;
        const yearQuery = `year:${startYear}-${endYear}`;

        // Fetch albums for this decade
        const data = await fetchFromSpotify(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            yearQuery
          )}&type=album&limit=50&market=DK`
        ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

        if (!data.albums.items.length) continue;

        // Extract artists from albums
        const artistsMap = new Map<string, { name: string; images: MediaImage[] }>();

        for (const album of data.albums.items) {
          for (const artist of album.artists) {
            if (!artistsMap.has(artist.id)) {
              artistsMap.set(artist.id, {
                name: artist.name,
                // Use album image if artist image not available
                images: album.images
                  ? album.images.slice(0, 1).map(img => ({
                      url: img.url,
                      width: img.width,
                      height: img.height,
                    }))
                  : [],
              });
            }
          }
        }

        const selectedArtists = Array.from(artistsMap.values()).slice(0, targetArtistsPerEra);

        if (!selectedArtists.length) continue;

        // Prepare images for the card
        const images = selectedArtists
          .map(a => a.images?.[0])
          .filter(Boolean)
          .slice(0, 4) as UpToFour<MediaImage>;

        eraPreviews[i] = {
          id: startYear,
          title: `${startYear}s`,
          images,
          meta: (
            <span className="text-xs opacity-70 line-clamp-2">
              {selectedArtists.map(a => a.name).join(" • ")}
              {selectedArtists.length < artistsMap.size && (
                <span className="opacity-50"> etc.</span>
              )}
            </span>
          ),
          href: `/era/${startYear}`,
          type: "era",
        };

        setItems([...eraPreviews]); // incremental update
      }
    }

    fetchData();
  }, []);

  return (
    <MediaSection title="Browse by era">
      {items === null ? (
        <MediaGridSkeleton variant="horizontal" />
      ) : items.every(i => i === null) ? (
        <p className="text-sm text-iplay-white/50">
          No artists available for these eras.
        </p>
      ) : (
        <MediaGrid
          items={items.map(item =>
            item ?? {
              id: `loading-${Math.random()}`,
              title: "Loading...",
              images: [],
              meta: null,
              href: "#",
              type: "era",
              loading: true,
            } as MediaGridItem
          )}
          variant="horizontal"
        />
      )}
    </MediaSection>
  );
}