"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface MediaCardProps {
  image?: {
    url: string;
    width?: number | null;
    height?: number | null;
    alt: string;
  };
  title: string;
  meta?: ReactNode;
  href?: string;
  className?: string;
}

export default function MediaCard({
  image,
  title,
  meta,
  href,
  className = "",
}: MediaCardProps) {
  const content = (
    <div
      className={`flex flex-col gap-2 border border-iplay-white/10 rounded-md shadow-2xl/10 shadow-iplay-grape overflow-hidden ${className}`}
    >
      {/* Image */}
      {image && (
        <figure className="w-full aspect-square overflow-hidden">
          <Image
            src={image.url}
            alt={image.alt}
            width={image.width ?? 512}
            height={image.height ?? 512}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </figure>
      )}

      {/* Content */}
      <div className="flex flex-col gap-1 px-2 pb-4">
        <strong className="text-lg">{title}</strong>
        {meta && (
          <div className="text-sm opacity-70 flex flex-wrap items-center gap-2">
            {meta}
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}