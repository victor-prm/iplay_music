"use client";

import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { fetchFromSpotify } from "../_lib/actions";
import Link from "next/link";
import FilterRadios from "./FilterRadios";

export default function SearchBar({ market = "DK" }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [filter, setFilter] = useState("all"); // default radio


    // Map radio value to Spotify types
    const filterMap: Record<string, string> = {
        all: "artist,album,track,playlist",
        artist: "artist",
        album: "album",
        track: "track",
        playlist: "playlist",
    };

    const typeKeyMap: Record<string, string> = {
        artist: "artists",
        album: "albums",
        track: "tracks",
        playlist: "playlists",
    };

    const debouncedSearch = useMemo(
        () =>
            debounce(async (value: string, types: string) => {
                if (!value) {
                    setResults([]);
                    return;
                }

                const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    value
                )}&type=${types}&market=${market}&limit=10`;

                const data = await fetchFromSpotify(url);

                const normalized: any[] = [];
                for (const type of types.split(",")) {
                    const key = typeKeyMap[type] || type + "s";
                    const items = data[key]?.items;
                    if (items?.length) {
                        normalized.push(
                            ...items
                                .filter((item: any) => item?.id) // <--- skip invalid
                                .map((item: any) => ({ type, item }))
                        );
                    }
                }

                const seen = new Set<string>();
                const uniqueResults = normalized.filter((res) => {
                    if (!res.item?.id) return false;
                    const id = `${res.type}-${res.item.id}`;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });

                setResults(uniqueResults.slice(0, 10));
                console.log(uniqueResults.slice(0, 10));
            }, 300),
        [market]
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setQuery(value);

        // fallback if filterMap[filter] is missing
        const types = filterMap[filter] || "artist,album,track,playlist";
        debouncedSearch(value, types);
    }

    function handleFilterChange(newFilter: string) {
        setFilter(newFilter);

        // rerun search immediately with new filter
        if (query) {
            const types = filterMap[newFilter] || "artist,album,track,playlist";
            debouncedSearch(query, types);
        }
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

            {results.length > 0 && (
                <div className="absolute w-full mt-2 bg-gray-400 z-10 p-2 rounded-md">
                    {/* Radios are now part of the results dropdown */}
                    <FilterRadios value={filter} onChange={handleFilterChange} />

                    <ul>
                        {results
                            .filter((res) => res.item) // guard null items
                            .map((res) => (
                                <li key={`${res.type}-${res.item.id}`} className="p-1 odd:bg-white/50">
                                    <Link
                                        href={`/${res.type}/${res.item.id}`}
                                        onClick={() => {
                                            setResults([]);
                                            setQuery("");
                                        }}
                                    >
                                        {res.item.name} - <span className="capitalize">{res.type}</span>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}