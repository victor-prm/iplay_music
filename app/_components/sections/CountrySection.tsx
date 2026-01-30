"use client";

import MediaSection from "../media_comps/MediaSection";
import CountryPill from "../CountryPill";
import { countries } from "@/app/_data/static";

export default function CountrySection() {
  return (
    <MediaSection title="Browse countries" isLoading={false}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {countries.map((country) => (
          <CountryPill
            key={country.code}
            country={country}
            href={`/genre/${country.adjective.replaceAll(" ","_").toLowerCase()}`}
          />
        ))}
      </div>
    </MediaSection>
  );
}