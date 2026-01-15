import { getArtistsByName } from "@/app/_lib/actions";
import { names1960s, names1970s, names1980s, names1990s, names2000s, names2010s, names2020s } from "../data/static";
import Image from "next/image";

export default async function ArtistsPage() {
    const decade_artists = names1990s



    const artists = await getArtistsByName(decade_artists);
    console.log(artists);

    return (
        <div>
            <h1>Artists of the decade</h1>
            <ul>
                {artists.map(artist => (
                    <li key={artist.id}>
                        <strong>{artist.name}</strong> — Followers: {artist.followers.total} — Popularity: {artist.popularity}
                        {artist.images?.[0] && (
                            <figure className="w-32 h-32">
                                <Image
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover"
                                />
                            </figure>

                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}