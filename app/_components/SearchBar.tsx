"use client";

import { useState } from "react";
import { fetchFromSpotify } from "../_lib/actions";
import Link from "next/link";

export default function SearchBar({ market = "DK" }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);

        if (!value) {
            setResults([]);
            return;
        }

        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            value
        )}&type=artist&market=${market}&limit=5`;

        const data = await fetchFromSpotify(url);
        setResults(data.artists.items);
    }
    return (
        <div className="flex flex-col relative w-[50%]">
            <input
                className="bg-white px-2"
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleChange}
            />

            <ul className="absolute mt-8 p-1 bg-gray-400">
                {results.map((artist) => (
                    <li key={artist.id} className="p-1 rounded-xs odd:bg-white/50">
                        <Link
                            href={`/artist/${artist.id}`}
                            onClick={() => {
                                setResults([]);
                                setQuery("");
                            }}
                        >
                            {artist.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

    );
}