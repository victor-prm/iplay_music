import Link from "next/link";
import { myCategories } from "../_data/static";
import { getArtistsByGenre } from "../_lib/actions";

interface GenrePreview {
    name: string;
    artists: string[];
    thumbnails: string[];
}

export default async function GenreOverviewPage() {
    const genrePreviews: GenrePreview[] = await Promise.all(
        myCategories.map(async (cat) => {
            const artists = await getArtistsByGenre(cat, 3);

            return {
                name: cat,
                artists: artists.map((a) => a.name),
                thumbnails: artists
                    .map((a) => a.images?.[2]?.url)
                    .filter((url): url is string => Boolean(url)),
            };
        })
    );

    return (
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl">Popular Genres</h1>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {genrePreviews.map((genre) => (
                    <li key={genre.name} className="block rounded-md border border-iplay-white/10 hover:bg-iplay-white/5 transition overflow-clip">
                        <Link
                            href={`/genre/${genre.name.replaceAll(" ", "_")}`}
                        >
                            {/* Artist thumbnails */}
                            <div className="grid grid-cols-3">
                                {genre.thumbnails.map((src, i) => (
                                    <img
                                        key={i}
                                        src={src}
                                        alt=""
                                        className="aspect-square object-cover"
                                    />
                                ))}
                            </div>
                            <hgroup className="p-2">
                                <h2 className="capitalize font-semibold">
                                    {genre.name}
                                </h2>
                                {/* Artist names */}
                                <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                                    {genre.artists.join(" • ")}
                                </p>
                            </hgroup>

                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}