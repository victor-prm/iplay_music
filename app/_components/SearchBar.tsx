"use client";

import { useState } from "react";
import type { FilterOptions } from "@/types/components";

import MusicItem from "./MusicItem";
import FilterRadios from "./FilterRadios";
import { useSpotifySearch } from "../_lib/hooks/useSpotifySearch";

interface SearchBarProps {
  market?: string;
}

export default function SearchBar({ market = "DK" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterOptions>("all");

  const { results, runSearch, setResults } = useSpotifySearch({ market });

  const filterMap: Record<FilterOptions, string> = {
    all: "artist,album,track,playlist",
    artist: "artist",
    album: "album",
    track: "track",
    playlist: "playlist",
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    runSearch(value, filterMap[filter]);
  }

  function handleFilterChange(newFilter: FilterOptions) {
    setFilter(newFilter);

    if (query) {
      runSearch(query, filterMap[newFilter]);
    }
  }

  return (
    <div className="relative w-full max-w-80">
      <input
        className="bg-iplay-plum/50 px-2 py-1 w-full rounded-sm placeholder-iplay-white/25 font-dm-sans border border-iplay-grape/25"
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleChange}
        id="search-field"
        name="search-field"
      />

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-3 bg-iplay-plum/75 backdrop-blur-xl z-10 rounded-md overflow-hidden">
          <div className="p-2 sticky top-0 z-10">
            <FilterRadios value={filter} onChange={handleFilterChange} />
          </div>

          <ul className="overflow-y-auto max-h-[calc(100vh-8rem)] px-2 pb-2">
            {results.map((res) => (
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