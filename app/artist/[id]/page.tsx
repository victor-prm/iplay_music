import { getAllAlbumsForArtist, fetchFromSpotify } from "@/app/_lib/actions";
import Link from "next/link";

export default async function ArtistPage({ params }: { params: any }) {
    // 🚨 Await params if they are a promise
    const { id: artistId } = await params;

    if (!artistId) {
        throw new Error("Artist ID is required");
    }

    // 1️⃣ Get all albums (only full albums)
    const albums = await getAllAlbumsForArtist(artistId, ["album"]);

    // 2️⃣ Get top tracks for this artist
    const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=DK`;
    const topTracksData: any = await fetchFromSpotify(topTracksUrl);
    const topTracks = topTracksData?.tracks || [];

    return (
        <div className="flex flex-col gap-8">
            <h1 className="font-bold">Artist Page</h1>

            <section>
                <h2 className="font-bold">Top Tracks</h2>
                <ul>
                    {topTracks.map((track: any) => (
                        <li key={track.id}>
                            {track.name} ({track.album?.name})
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="font-bold">Albums</h2>
                <ul>
                    {albums.map((album: any) => (
                        <li key={album.id}>
                            <Link href={`/album/${album.id}`}>{album.name} ({album.release_date.substring(0, 4)})</Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}