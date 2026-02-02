import { fetchFromSpotify } from "@/app/_lib/dal";
import MediaHero from "@/app/_components/media_comps/MediaHero";
import TrackList from "@/app/_components/TrackList";
import type { TrackFull } from "@/types/spotify";
import type { MediaImage } from "@/types/components";

type PlaylistLite = {
  id: string;
  name: string;
  image?: MediaImage;
  ownerName: string;
  tracks: {
    total: number;
    items: TrackFull[];
  };
};

function mapPlaylistToLite(data: any): PlaylistLite {
  return {
    id: data.id,
    name: data.name,
    image: data.images?.[0]
      ? {
          url: data.images[0].url,
          width: data.images[0].width,
          height: data.images[0].height,
          alt: data.name,
        }
      : undefined,
    ownerName: data.owner?.display_name ?? "Unknown",
    tracks: {
      total: data.tracks?.total ?? 0,
      items:
        data.tracks?.items?.map((t: any) => t.track).filter(Boolean) ?? [],
    },
  };
}

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: playlistId } = await params;

  if (!playlistId) return <p>No playlist ID provided.</p>;

  const data = await fetchFromSpotify(`https://api.spotify.com/v1/playlists/${playlistId}?market=DK`);
  const playlist = mapPlaylistToLite(data);

  return (
    <div className="flex flex-col gap-4">
      <MediaHero title={playlist.name} images={playlist.image}>
        <p className="opacity-70 font-dm-sans">
          By {playlist.ownerName} • {playlist.tracks.total} tracks
        </p>
      </MediaHero>

      {playlist.tracks.items.length > 0 && (
        <TrackList discs={[{ discNumber: 1, tracks: playlist.tracks.items }]} />
      )}
    </div>
  );
}