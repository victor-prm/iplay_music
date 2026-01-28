import TrackList from "@/app/_components/TrackList";
import { fetchFromSpotify } from "@/app/_lib/dal";
import type { Disc, AlbumFull, TrackFull } from "@/types/spotify";
import { formatDate } from "@/app/_utils/helpers";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ highlight?: string }>;
}

export default async function AlbumPage({ params, searchParams }: AlbumPageProps) {
  const { id: albumId } = await params;
  const { highlight: highlightId } = searchParams ? await searchParams : { highlight: undefined };

  if (!albumId) return <p>No album ID provided.</p>;

  // Fetch full album
  const album = await fetchFromSpotify(
    `https://api.spotify.com/v1/albums/${albumId}`
  ) as AlbumFull;

  // The tracks array is TrackObjectSimplified[], so fetch full tracks in batches
  const trackIds = album.tracks.items.map(t => t.id).filter(Boolean);
  let fullTracks: TrackFull[] = [];

  // Spotify's Get Several Tracks endpoint accepts up to 50 IDs
  for (let i = 0; i < trackIds.length; i += 50) {
    const batch = trackIds.slice(i, i + 50).join(",");
    const data = await fetchFromSpotify(
      `https://api.spotify.com/v1/tracks?ids=${batch}`
    ) as { tracks: TrackFull[] };
    fullTracks = fullTracks.concat(data.tracks);
  }

  // Group tracks by disc
  const discsMap: Record<number, TrackFull[]> = {};
  fullTracks.forEach(track => {
    const discNumber = track.disc_number || 1;
    if (!discsMap[discNumber]) discsMap[discNumber] = [];
    discsMap[discNumber].push(track);
  });

  const discs: Disc[] = Object.keys(discsMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map(discNumber => ({ discNumber, tracks: discsMap[discNumber] }));

  return (
    <div>
      <h1 className="text-2xl font-bold">{album.name}</h1>
      {album.release_date && (
        <p className="text-sm opacity-70 font-dm-sans">
          Released: {formatDate(album.release_date, album.release_date_precision)}
        </p>
      )}
      {album.images?.[0] && (
        <img
          src={album.images[0].url}
          alt={`Cover for ${album.name}`}
          width={album.images[0].width}
          height={album.images[0].height}
          className="my-4 rounded-md"
        />
      )}
      <TrackList discs={discs} highlightId={highlightId} />
    </div>
  );
}