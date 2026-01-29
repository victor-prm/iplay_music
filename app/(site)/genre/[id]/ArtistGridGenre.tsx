"use client";

import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import type { UpToFour, MediaImage } from "@/types/components";
import type { ArtistFull } from "@/types/spotify";

interface Props {
    initialArtists: ArtistFull[];
}

export default function ArtistGridGenre({ initialArtists }: Props) {
    // Map artists to MediaGridItems
    const gridItems: MediaGridItem[] = initialArtists.map(artist => ({
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

    return <MediaGrid items={gridItems} />;
}