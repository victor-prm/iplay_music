"use client";

import { useEffect, useState } from "react";
import MediaGrid, { MediaGridItem } from "../media_comps/MediaGrid";
import MediaSection from "../media_comps/MediaSection";
import { fetchFromSpotify } from "@/app/_lib/dal";
import type { UpToFour, MediaImage } from "@/types/components";

export default function EraSection() {
    const [items, setItems] = useState<MediaGridItem[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            const eras = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
            const targetArtistsPerEra = 3;

            // Map each era to a fetch promise
            const eraPromises = eras.map(async (startYear) => {
                const endYear = startYear + 9;
                const data = await fetchFromSpotify(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                        `year:${startYear}-${endYear}`
                    )}&type=album&limit=50&market=DK`
                ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

                if (!data.albums.items.length) return null;

                const artistMap = new Map<string, { name: string; image?: MediaImage }>();
                for (const album of data.albums.items) {
                    const artist = album.artists[0];
                    if (!artist || artistMap.has(artist.id)) continue;
                    const img = album.images?.[0];
                    artistMap.set(artist.id, {
                        name: artist.name,
                        image: img
                            ? {
                                url: img.url,
                                width: img.width,
                                height: img.height,
                                alt: `${artist.name} image`,
                            }
                            : undefined,
                    });
                }

                const selected = Array.from(artistMap.values()).slice(0, targetArtistsPerEra);
                if (!selected.length) return null;

                const images = selected.map(a => a.image).filter(Boolean) as UpToFour<MediaImage>;

                return {
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
                } as MediaGridItem;
            });

            // Wait for all fetches in parallel
            const eraResults = await Promise.all(eraPromises);

            // Filter nulls
            setItems(eraResults.filter(Boolean) as MediaGridItem[]);
        }

        fetchData();
    }, []);

    const placeholders = Array.from({ length: 12 }, (_, i) => ({
        id: `placeholder-${i}`,
        title: "",
        images: [] as UpToFour<MediaImage>,
        meta: null,
        href: "#",
        type: "genre",
    }));

    return (
        <MediaSection title="Browse by era">
            <MediaGrid
                items={items ?? placeholders}
                variant="horizontal"
            />
        </MediaSection>
    );
}