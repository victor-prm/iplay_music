"use client";

import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { fetchFromSpotify } from "../_lib/actions";

import MusicItem from "./MusicItem";
import FilterRadios from "./FilterRadios";
import Fuse from "fuse.js";


type SearchResult = {
    type: "artist" | "album" | "track" | "playlist";
    item:
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.AlbumObjectFull
    | SpotifyApi.TrackObjectFull
    | SpotifyApi.PlaylistObjectFull;
};


export default function SearchBar({ market = "DK" }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [filter, setFilter] = useState("all");


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
                    const key = type + "s";
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

                const fuse = new Fuse(uniqueResults, { keys: ["item.name"], threshold: 0.7 });
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


    return (
        <div className="relative w-full max-w-80">
            <input
                className="bg-iplay-plum px-2 py-1 w-full rounded-sm placeholder-iplay-white/25 font-dm-sans"
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleChange}
                id="search-field"
                name="search-field"
            />

            {results.length > 0 && (
                <div
                    className="absolute left-0 right-0 top-full mt-3 bg-iplay-plum/75 backdrop-blur-xl z-10 rounded-md overflow-hidden"
                >
                    {/* Radios sticky at the top */}
                    <div className="p-2 sticky top-0 z-10">
                        <FilterRadios value={filter} onChange={handleFilterChange} />
                    </div>

                    {/* Scrollable list */}

                    <ul className="overflow-y-auto max-h-[calc(100vh-8rem)] px-2 pb-2">
                        {results
                            .filter((res) => res.item)
                            .map((res) => (
                                <MusicItem
                                    key={`${res.type}-${res.item.id}`}
                                    res={res}
                                    onSelect={() => {
                                        setResults([]);
                                        setQuery("");
                                    }}
                                />
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}