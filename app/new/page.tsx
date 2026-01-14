import { fetchFromSpotify } from "../_lib/actions";

export default async function Page() {
    const data: any = await fetchFromSpotify(
        `https://api.spotify.com/v1/browse/new-releases?country=DK&type=album&limit=20`
    );

    const albums = data.albums?.items || [];

    console.log(albums);

    return (
        <div>
            <h1>New Releases</h1>
            <ul>
                {albums.map((album: any) => (
                    <li key={album.id}>
                        {album.name} — {album.artists.map((a: any) => a.name).join(", ")}
                    </li>
                ))}
            </ul>
        </div>
    );
}