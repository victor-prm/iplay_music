import Link from "next/link";
import Image from "next/image";
import { myCategories } from "../_data/static";
import { getArtistsByGenre } from "../_lib/dal";

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

            <ul className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {genrePreviews.map((genre, i) => (
                    <li key={genre.name}
                        className="block rounded-md border border-iplay-white/10 hover:bg-iplay-white/5 transition overflow-clip"
                        style={{ opacity: 0, animation: `300ms fade-in forwards ${String(25 + i * 25)}ms` }}
                    >
                        <Link
                            href={`/genre/${genre.name.replaceAll(" ", "_")}`}
                        >
                            {/* Artist thumbnails */}
                            <div className="grid grid-cols-3">
                                {genre.thumbnails.map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt={src}
                                        className="aspect-square size-full object-cover"
                                        width={160}
                                        height={160}
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