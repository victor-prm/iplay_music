"use client";

import { useState, useEffect } from "react";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import { getArtistsByGenre } from "@/app/_lib/dal";
import type { UpToFour, MediaImage } from "@/types/components";
import type { ArtistFull } from "@/types/spotify";

interface Props {
    genreSlug: string;
    initialArtists: ArtistFull[];
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

        // Fetch next batch of artists directly using DAL
        const newArtists = await getArtistsByGenre(
            genreSlug,
            pageSize,
            "DK",
            5,          // max tries
            pageSize,   // limit per page
        );

        // Filter out already seen artists
        const uniqueNew = newArtists.filter(a => !seenArtistIds.includes(a.id));

        if (!uniqueNew.length) {
            setHasMore(false);
            setLoading(false);
            return;
        }

        setSeenArtistIds(prev => [...prev, ...uniqueNew.map(a => a.id)]);
        setArtists(prev => [...prev, ...uniqueNew]);
        setOffset(prev => prev + uniqueNew.length);
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