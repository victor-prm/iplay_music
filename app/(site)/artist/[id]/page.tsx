// app/artist/[id]/page.tsx
/// <reference types="spotify-api" />

import { AlbumFull, TrackFull, ArtistFull } from "@/types/spotify";
import { abbreviateNumber } from "@/app/_utils/helpers";

import Image from "next/image";
import Link from "next/link";
import { getAllAlbumsForArtist, fetchFromSpotify } from "@/app/_lib/dal";


interface ArtistPageProps {
    params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
    const { id: artistId } = await params;

    if (!artistId) throw new Error("Artist ID is required");

    const albums: AlbumFull[] = await getAllAlbumsForArtist(artistId, ["album"]);

    const artistInfo: ArtistFull = await fetchFromSpotify(
        `https://api.spotify.com/v1/artists/${artistId}?market=DK`
    );

    console.log(artistInfo)

    const topTracksData: { tracks: TrackFull[] } = await fetchFromSpotify(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=DK`
    );
    const topTracks: TrackFull[] = topTracksData.tracks || [];

    return (
        <div className="flex flex-col gap-8">
            <figure className="relative -mx-4 -mt-4">
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
                    <hgroup className="flex flex-col gap-2 absolute bottom-0 p-4">
                        <h1 className=" font-bold text-6xl font-poppins">{artistInfo.name}</h1>
                        <p className="font-dm-sans">{artistInfo.followers.total  > 0 && abbreviateNumber(artistInfo.followers.total)} followers</p>
                    </hgroup>

                </div>
            </figure>





            {topTracks.length > 0 && (
                <section>
                    <h2 className="font-bold text-xl mb-2 font-poppins">Top Tracks</h2>
                    <ul className="flex flex-col gap-1">
                        {topTracks.map((track) => (
                            <li key={track.id}>
                                {track.name} {track.album?.name && <>({track.album.name})</>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {albums.length > 0 && (
                <section>
                    <h2 className="font-bold text-xl mb-2">Albums</h2>
                    <ul className="flex flex-col gap-1">
                        {albums.map((album) => (
                            <li key={album.id}>
                                <Link href={`/album/${album.id}`} className="hover:underline">
                                    {album.name} ({album.release_date?.substring(0, 4)})
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}