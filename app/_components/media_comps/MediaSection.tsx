// MediaSection.tsx
import { Suspense, ReactNode } from "react";
import MediaGridSkeleton from "./MediaGridSkeleton";

interface MediaSectionProps {
  title?: string;
  titleClassName?: string;
  variant?: "vertical" | "horizontal";
  children: ReactNode;
}

export default function MediaSection({
  title,
  titleClassName = "",
  variant = "vertical",
  children,
}: MediaSectionProps) {
    console.log(variant, children)

  return (
    <section className="flex flex-col gap-4">
      {(title) && (
        <h2 className={`text-2xl font-bold font-dm-sans ${titleClassName}`}>
          {title}
        </h2>
      )}
      <Suspense
        fallback={<MediaGridSkeleton showTitle={false} variant={variant} />}
      >
        {children}
      </Suspense>
    </section>
  );
}