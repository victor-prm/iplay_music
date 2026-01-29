"use client";

import { useRef, useState, useEffect } from "react";
import MediaCard from "./MediaCard";
import type { MediaImage } from "@/types/components";
import { UpToFour } from "@/types/components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface MediaGridItem {
  id: string | number;
  title: string;
  images?: UpToFour<MediaImage>;
  meta?: React.ReactNode;
  href?: string;
  type?: string;
}

type MediaGridVariant = "vertical" | "horizontal";

interface MediaGridProps {
  items: MediaGridItem[];
  variant?: MediaGridVariant;
  title?: string;
  titleClassName?: string;
  loadingShape?: "square" | "wide" | "tall";
  minLoadingMs?: number; // NEW
}

export default function MediaGrid({
  items,
  variant = "vertical",
  loadingShape = "square",
  minLoadingMs = 600, // default 300ms delay
}: MediaGridProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showItems, setShowItems] = useState(false);

  // Minimum loading delay
  useEffect(() => {
    setShowItems(false);
    const timer = setTimeout(() => setShowItems(true), minLoadingMs);
    return () => clearTimeout(timer);
  }, [items, minLoadingMs]);

  // Update scroll buttons visibility
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for rounding errors
  };

  const scrollByCard = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 240 + 16; // card width + gap
    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons(); // initial check
    const handler = () => updateScrollButtons();
    el.addEventListener("scroll", handler);
    window.addEventListener("resize", handler);
    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const listClass =
    variant === "horizontal"
      ? "grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
      : "grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4";

  return (
    <div className="relative">
      {variant === "horizontal" && canScrollLeft && (
        <button
          className="absolute flex justify-center items-center cursor-pointer backdrop-blur-[1px] border border-iplay-white/25 -left-2 bottom-0 -translate-y-1/2 z-10 size-6 rounded-full bg-iplay-white/10 hover:opacity-50 text-white"
          onClick={() => scrollByCard("left")}
        >
          <FaChevronLeft className="size-2" />
        </button>
      )}
      {variant === "horizontal" && canScrollRight && (
        <button
          className="absolute flex justify-center items-center cursor-pointer backdrop-blur-[1px] border border-iplay-white/25 -right-2 bottom-0 -translate-y-1/2 z-10 size-6 rounded-full bg-iplay-white/10 hover:opacity-50 text-white"
          onClick={() => scrollByCard("right")}
        >
          <FaChevronRight className="size-2" />
        </button>
      )}

      <ul ref={scrollRef} className={`${listClass} auto-rows-fr`}>
        {(showItems ? items : Array(items.length).fill(null)).map((item, i) => (
          <li
            key={item?.id ?? `placeholder-${i}`}
            className={`h-full ${variant === "horizontal" ? "snap-center" : ""}`}
          >
            <MediaCard
              title={item?.title ?? " "}           // placeholder title
              href={item?.href ?? "#"}            // placeholder href
              type={item?.type ?? "album"}        // placeholder type
              meta={item?.meta ?? null}           // optional
              images={item?.images ?? []}         // empty for loading
              loadingShape={loadingShape}         // keep your aspect ratio
            />
          </li>
        ))}
      </ul>
    </div>
  );
}