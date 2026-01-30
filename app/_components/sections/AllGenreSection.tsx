"use client";
import GenrePill from "../GenrePill";
import MediaSection from "../media_comps/MediaSection";
import { myCategories } from "@/app/_data/static";

export default function AllGenreSection() {
    return (
        <MediaSection title="Browser genres" isLoading={false}>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                {myCategories.map((genre) => (
                    <GenrePill
                        key={genre}
                        genre={genre}
                        href={`/genre/${genre.replaceAll(" ", "_").toLowerCase()}`}
                    />
                ))}
            </div>
        </MediaSection>
    );
}