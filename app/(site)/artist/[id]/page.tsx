// app/artist/[id]/page.tsx
/// <reference types="spotify-api" />

import { AlbumFull, TrackFull, ArtistFull } from "@/types/spotify";
import { abbreviateNumber, formatDate } from "@/app/_utils/helpers";
import AllGenreSection from "@/app/_components/sections/AllGenreSection";

import Image from "next/image";
import MediaSection from "@/app/_components/media_comps/MediaSection";
import MediaGrid, { MediaGridItem } from "@/app/_components/media_comps/MediaGrid";
import TrackList from "@/app/_components/TrackList";
import { getAllAlbumsForArtist, fetchFromSpotify } from "@/app/_lib/dal";

interface ArtistPageProps {
    params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
    const { id: artistId } = await params;
    if (!artistId) throw new Error("Artist ID is required");

    // Fetch all album groups
    const albumsByGroup = await getAllAlbumsForArtist(artistId, [
        "album",
        "single",
        "compilation",
        "appears_on",
    ]);

    // Fetch artist info
    const artistInfo: ArtistFull = await fetchFromSpotify(
        `https://api.spotify.com/v1/artists/${artistId}?market=DK`
    );

    // Fetch top tracks
    const topTracksData: { tracks: TrackFull[] } = await fetchFromSpotify(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=DK`
    );
    const topTracks: TrackFull[] = topTracksData.tracks || [];

    // Map group keys to readable section titles
    const groupTitles: Record<string, string> = {
        album: "Albums",
        single: "Singles",
        compilation: "Compilations",
        appears_on: "Appears On",
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Artist Header */}
            <figure className="relative -m-4">
                {artistInfo.images?.[0] && (
                    <Image
                        src={artistInfo.images[0].url}
                        alt={artistInfo.name}
                        width={artistInfo.images[0].width}
                        height={artistInfo.images[0].height}
                        className="w-full max-h-[40vh] rounded-2xl object-cover object-[0_25%]"
                    />
                )}
                <div className="absolute inset-0 rounded-2xl bg-iplay-black/50 backdrop-blur-sm">
                    <hgroup className="flex flex-col gap-1 absolute bottom-0 p-4">
                        <h1 className="font-bold text-6xl font-poppins">{artistInfo.name}</h1>
                        <p className="font-dm-sans">
                            {artistInfo.followers.total > 0 && abbreviateNumber(artistInfo.followers.total)} followers
                        </p>
                    </hgroup>
                </div>
            </figure>

            {/* Top Tracks */}
            {topTracks.length > 0 && (
                <TrackList
                    title="Popular songs"
                    discs={[
                        {
                            discNumber: 1,
                            tracks: topTracks,
                        },
                    ]}
                />
            )}

            <AllGenreSection
                genres={artistInfo.genres}
                title={`Genres for ${artistInfo.name}`}
            />

            {/* Albums / Singles / Compilations / Appears On */}
            {Object.entries(albumsByGroup).map(([group, items]) =>
                items.length > 0 ? (
                    <MediaSection key={group} title={groupTitles[group] || group} isLoading={false}>
                        <MediaGrid
                            variant="horizontal"
                            items={items.map<MediaGridItem>((album: AlbumFull) => ({
                                id: album.id,
                                title: album.name,
                                images: album.images?.[0]
                                    ? [
                                        {
                                            url: album.images[0].url,
                                            width: album.images[0].width,
                                            height: album.images[0].height,
                                            alt: album.name,
                                        },
                                    ]
                                    : undefined,
                                href: `/album/${album.id}`,
                                type: "album",
                                meta: album.release_date ? formatDate(album.release_date, "day") : undefined,
                            }))}
                            loadingShape="wide"
                            minLoadingMs={0}
                        />
                    </MediaSection>
                ) : null
            )}
        </div>
    );
}