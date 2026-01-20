import { getAlbumTracks } from "@/app/_lib/actions";

export default async function AlbumPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ highlight?: string }>;
}) {
  const { id: albumId } = await params;
  const { highlight } = await searchParams;

  const tracks = await getAlbumTracks(albumId);

  return (
    <div>
      <h1>Tracks for album {albumId}</h1>

      <ul>
        {tracks.map((track: any, i: number) => {
          const isHighlighted = track.id === highlight;

          return (
            <li
              key={track.id}
              className={`p-2`}
            >
              <span className="opacity-50 w-6 inline-block text-right">
                {i + 1}
              </span>{" "}
              <span className={isHighlighted ? "text-iplay-coral" : ""}>{track.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}