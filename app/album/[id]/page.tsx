import { getAlbumTracks } from "@/app/_lib/dal";
import TrackList from "@/app/_components/TrackList";
import type { Disc } from "@/types/spotify";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ highlight?: string }>;
}

export default async function AlbumPage({ params, searchParams }: AlbumPageProps) {
  const { id: albumId } = await params;
  const { highlight: highlightId } = searchParams ? await searchParams : { highlight: undefined };

  if (!albumId) return <p>No album ID provided.</p>;

  const discs: Disc[] = await getAlbumTracks(albumId); // getAlbumTracks now returns Disc[]

  return (
    <div>
      <h1>Tracks for album {albumId}</h1>
      <TrackList discs={discs} highlightId={highlightId} />
    </div>
  );
}