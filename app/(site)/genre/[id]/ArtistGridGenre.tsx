"use client";

import { useState, useEffect } from "react";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import { fetchFromSpotify } from "@/app/_lib/dal";
import type { UpToFour, MediaImage } from "@/types/components";

interface Props {
    genreSlug: string;
    initialArtists: SpotifyApi.ArtistObjectFull[]; // <-- changed
    pageSize: number;
}

export default function ArtistGridGenre({ genreSlug, initialArtists, pageSize }: Props) {
    const [artists, setArtists] = useState(initialArtists);
    const [seenArtistIds, setSeenArtistIds] = useState(initialArtists.map(a => a.id));
    const [offset, setOffset] = useState(initialArtists.length);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [gridItems, setGridItems] = useState<MediaGridItem[]>([]);

    // Map artists to grid items
    useEffect(() => {
        const items: MediaGridItem[] = artists.map(artist => ({
            id: artist.id,
            title: artist.name,
            href: `/artist/${artist.id}`,
            type: "artist",
            meta: `${artist.followers?.total.toLocaleString()} followers`,
            images: artist.images?.[0]
                ? ([{
                    url: artist.images[0].url,
                    width: artist.images[0].width,
                    height: artist.images[0].height,
                    alt: artist.name,
                }] as unknown as UpToFour<MediaImage>)
                : undefined,
        }));

        setGridItems(items);
    }, [artists]);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        // fetch albums to discover new artists
        const data = await fetchFromSpotify(
            `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(
                genreSlug
            )}&type=album&limit=${pageSize}&offset=${offset}&market=DK`
        ) as { albums: { items: SpotifyApi.AlbumObjectSimplified[] } };

        if (!data.albums.items.length) {
            setHasMore(false);
            setLoading(false);
            return;
        }

        setOffset(prev => prev + data.albums.items.length);

        // Extract first artist from each album
        const newArtistsBatch = Array.from(
            new Set(data.albums.items.map(a => a.artists[0]?.id).filter(Boolean))
        ).filter(id => !seenArtistIds.includes(id!));

        if (!newArtistsBatch.length) {
            setHasMore(false);
            setLoading(false);
            return;
        }

        // Fetch full info for new artists in batches of 50
        const fullArtists: SpotifyApi.ArtistObjectFull[] = [];
        for (let i = 0; i < newArtistsBatch.length; i += 50) {
            const batch = newArtistsBatch.slice(i, i + 50);
            const resp = await fetchFromSpotify(
                `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`
            ) as { artists: SpotifyApi.ArtistObjectFull[] };
            fullArtists.push(...resp.artists);
        }

        setSeenArtistIds(prev => [...prev, ...fullArtists.map(a => a.id)]);
        setArtists(prev => [...prev, ...fullArtists]);
        setLoading(false);
    };

    return (
        <>
            <MediaGrid items={gridItems} />
            {hasMore && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-4 py-2 rounded-md bg-iplay-white/10 hover:bg-iplay-white/20 disabled:opacity-50"
                    >
                        {loading ? "Loading…" : "Load more"}
                    </button>
                </div>
            )}
        </>
    );
}