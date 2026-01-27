"use client";

import { useState } from "react";
import type { FilterOptions } from "@/types/components";

import MusicItem from "./MusicItem";
import FilterRadios from "./FilterRadios";
import { useSpotifySearch } from "../_lib/hooks/useSpotifySearch";

import { FaSearch, FaTimes } from "react-icons/fa";


interface SearchBarProps {
  market?: string;
}

export default function SearchBar({ market = "DK" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false)
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

  function handleToggle() {
    setOpen(!open);
  }

  console.log(results)

  return (
    <div className="relative w-fit flex justify-end">
      <div className="relative overflow-x-clip transition-width duration-300" style={{"width" : open ? "320px" : "0px"}}>

        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-iplay-white/40 pointer-events-none" />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          id="search-field"
          name="search-field"
          className="bg-iplay-plum pl-8 py-0.5 w-full rounded-sm inset-shadow-iplay-grape/20 inset-shadow-sm font-dm-sans border border-iplay-grape/25 placeholder-iplay-white/40"
          placeholder="Search"
        />

        {
        results.length > 0 && (
          
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
      <button className="flex items-center justify-center px-2 cursor-pointer" onClick={handleToggle}>
        {open ? <FaTimes /> : <FaSearch />}
      </button>
    </div>
  );
}