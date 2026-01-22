"use client";

import { useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import Fuse from "fuse.js";
import { fetchFromSpotify } from "../dal";
import type { FilterOptions, SearchResult } from "@/types/components";
import type { UseSpotifySearchProps } from "@/types/hooks";
import type { ArtistFull, AlbumFull, TrackFull, PlaylistFull } from "@/types/spotify";


export function useSpotifySearch({ market = "DK", debounceMs = 300 }: UseSpotifySearchProps = {}) {
    const [results, setResults] = useState<SearchResult[]>([]);

    const typeMap = {
        artist: (item: any) => item as ArtistFull,
        album: (item: any) => item as AlbumFull,
        track: (item: any) => item as TrackFull,
        playlist: (item: any) => item as PlaylistFull,
    } as const;

    // Debounced search function
    const search = useMemo(
        () =>
            debounce(async (query: string, types: string) => {
                if (!query) {
                    setResults([]);
                    return;
                }

                const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    query
                )}&type=${types}&market=${market}&limit=10`;

                const data = await fetchFromSpotify(url);

                const normalized: SearchResult[] = [];

                for (const type of types.split(",") as Exclude<FilterOptions, "all">[]) {
                    const key = type + "s";
                    const items = data[key]?.items as any[] | undefined;
                    if (!items?.length) continue;

                    items
                        .filter((item) => item?.id)
                        .forEach((item) => {
                            normalized.push({
                                type,
                                item: typeMap[type](item),
                            } as SearchResult); // assert it’s a valid union member
                        });
                }

                // Deduplicate
                const seen = new Set<string>();
                const uniqueResults = normalized.filter((res) => {
                    const id = `${res.type}-${res.item.id}`;
                    if (seen.has(id)) return false;
                    seen.add(id);
                    return true;
                });

                // Fuzzy search
                const fuse = new Fuse(uniqueResults, { keys: ["item.name"], threshold: 0.7 });
                const bestMatches: SearchResult[] = fuse
                    .search(query)
                    .map((r) => {
                        const type = r.item.type as Exclude<FilterOptions, "all">;
                        const castItem = typeMap[type](r.item.item);
                        return { type, item: castItem } as SearchResult;
                    });
                setResults(bestMatches.slice(0, 10));
            }, debounceMs),
        [market, debounceMs]
    );

    // Callback to trigger search
    const runSearch = useCallback((query: string, types: string) => {
        search(query, types);
    }, [search]);

    return { results, runSearch, setResults };
}