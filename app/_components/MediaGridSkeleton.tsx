// app/genre-overview/GenreFeedSkeleton.tsx
import MediaCard from "./MediaCard";

export default function MediaGridSkeleton({ count = 8 }) {
    return (
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i}>
                    <MediaCard loading />
                </li>
            ))}
        </ul>
    );
}