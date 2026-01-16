"use client";

import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { fetchFromSpotify } from "../_lib/actions";
import Link from "next/link";
import FilterRadios from "./FilterRadios";
import Fuse from "fuse.js";

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

    function getResultMeta(res: any): string | null {
        if (res.type === "album" || res.type === "track") {
            return res.item.artists?.[0]?.name ?? null;
        }

        if (res.type === "playlist") {
            return res.item.owner?.display_name ?? null;
        }

        return null;
    }

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

                const fuse = new Fuse(uniqueResults, { keys: ["item.name"], threshold: 0.5 });
                const bestMatches = fuse.search(value).map(res => res.item);
                setResults(bestMatches.slice(0, 10));
                console.log(bestMatches.slice(0, 10));
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
    //overflow-y-auto [overflow-y:overlay] [scrollbar-gutter:stable]
    return (
        <div className="relative w-full max-w-80">
            <input
                className="bg-white px-2 w-full"
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleChange}
                id="search-field"
                name="search-field"
            />

            {results.length > 0 && (
                <div
                    className="absolute left-0 right-0 top-full mt-3 bg-gray-400/50 backdrop-blur-xl z-10 rounded-md overflow-hidden"
                >
                    {/* Radios sticky at the top */}
                    <div className="p-2 sticky top-0 z-10">
                        <FilterRadios value={filter} onChange={handleFilterChange} />
                    </div>

                    {/* Scrollable list */}

                    <ul className="overflow-y-auto max-h-[calc(100vh-8rem)] px-2">
                        {results
                            .filter((res) => res.item)
                            .map((res) => {
                                const item = res.item;
                                const meta = getResultMeta(res);

                                return (
                                    <li
                                        key={`${res.type}-${item.id}`}
                                        className="p-1 odd:bg-white/50 rounded-sm"
                                    >
                                        <Link
                                            href={`/${res.type}/${item.id}`}
                                            onClick={() => {
                                                setResults([]);
                                                setQuery("");
                                            }}
                                        >
                                            <article className="flex flex-col">
                                                <h3>{item.name}</h3>
                                                

                                                <small className="capitalize opacity-50">
                                                    {res.type}
                                                    {meta && <> • {meta}</>}
                                                </small>
                                            </article>
                                        </Link>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
        </div>
    );
}