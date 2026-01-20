// app/album/[id]/page.tsx
import { getAlbumTracks } from "@/app/_lib/actions";
import TrackList from "@/app/_components/TrackList";

export default async function AlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ highlight?: string }>;
}) {
  const { id: albumId } = await params;
  const { highlight: highlightId } = searchParams ? await searchParams : { highlight: undefined };

  if (!albumId) {
    return <p>No album ID provided.</p>;
  }

  const discs = await getAlbumTracks(albumId); // now returns discs

  return (
    <div>
      <h1>Tracks for album {albumId}</h1>
      <TrackList discs={discs} highlightId={highlightId} />
    </div>
  );
}