import { fetchFromSpotify } from "@/app/_lib/actions";
import Image from "next/image";

type PlaylistLite = {
    id: string;
    name: string;
    image?: {
        url: string;
        width?: number;
        height?: number;
    };
    ownerName: string;
    tracks: {
        total: number;
        items: Array<{
            id: string;
            name: string;
            artists: string[];
            durationMs: number;
            trackNumber: number;
        }>;
    };
};

function mapPlaylistToLite(data: any): PlaylistLite {
    return {
        id: data.id,
        name: data.name,
        image: data.images?.[0]
            ? {
                url: data.images[0].url,
                width: data.images[0].width ?? undefined,
                height: data.images[0].height ?? undefined,
            }
            : undefined,
        ownerName: data.owner?.display_name ?? "Unknown",
        tracks: {
            total: data.tracks?.total ?? 0,
            items:
                data.tracks?.items?.map((t: any) => ({
                    id: t.track?.id,
                    name: t.track?.name,
                    artists:
                        t.track?.artists?.map((a: any) => a.name) ?? [],
                    durationMs: t.track?.duration_ms ?? 0,
                    trackNumber: t.track?.track_number ?? 0,
                })) ?? [],
        },
    };
}

export default async function PlaylistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = await params;
    const playlistId = resolvedParams.id;

    if (!playlistId) {
        return <p>No playlist ID provided.</p>;
    }

    const data = await fetchFromSpotify(
        `https://api.spotify.com/v1/playlists/${playlistId}?market=DK&limit=20`
    );

    const playlist = mapPlaylistToLite(data);

    return (
        <div className="p-4">
            <header className="flex flex-col gap-4 mb-6">
                {playlist.image && (
                    <Image
                        src={playlist.image.url}
                        alt={playlist.name}
                        width={playlist.image.width ?? 160}
                        height={playlist.image.height ?? 160}
                        className="rounded-md"
                    />
                )}

                <div>
                    <h1 className="text-2xl font-bold">{playlist.name}</h1>
                    <p className="opacity-60">
                        By {playlist.ownerName} • {playlist.tracks.total} tracks
                    </p>
                </div>
            </header>

            <ul className="space-y-2">
                {playlist.tracks.items.map((track, i) => (
                    <li key={track.id} className="flex gap-2">
                        <span className="opacity-50 w-6 text-right">
                            {i + 1}
                        </span>

                        <div>
                            <div>{track.name}</div>
                            <small className="opacity-60">
                                {track.artists.join(", ")}
                            </small>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}