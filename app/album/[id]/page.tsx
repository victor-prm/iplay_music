import { getAlbumTracks } from "@/app/_lib/actions";

export default async function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // <-- unwrap the promise
  const albumId = resolvedParams.id;

  if (!albumId) {
    return <p>No album ID provided.</p>;
  }

  console.log("Album ID:", albumId);

  const tracks = await getAlbumTracks(albumId);

  return (
    <div>
      <h1>Tracks for album {albumId}</h1>
      <ul>
        {tracks.map((track: any) => (
          <li key={track.id}>
            {track.track_number}. {track.name}
          </li>
        ))}
      </ul>
    </div>
  );
}