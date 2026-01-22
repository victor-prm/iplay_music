"use client";

import { useState, useMemo, useCallback } from "react";
import { debounce } from "lodash";
import Fuse from "fuse.js";
import { fetchFromSpotify } from "../dal";
import type { FilterOptions, SearchResult } from "@/types/components";


interface UseSpotifySearchProps {
    market?: string;
    debounceMs?: number;
}

export function useSpotifySearch({ market = "DK", debounceMs = 300 }: UseSpotifySearchProps = {}) {
    const [results, setResults] = useState<SearchResult[]>([]);

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

                for (const type of types.split(",")) {
                    const key = type + "s"; // e.g., artists, albums
                    const items = data[key]?.items as any[] | undefined;
                    if (!items?.length) continue;

                    normalized.push(
                        ...items
                            .filter((item) => item?.id)
                            .map((item) => ({ type: type as Exclude<FilterOptions, "all">, item }))
                    );
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
                    .map((r) => ({
                        type: r.item.type,
                        item: r.item.item,
                    }));

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