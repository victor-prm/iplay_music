import { Suspense, ReactNode, Children } from "react";
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

  return (
    <section className="flex flex-col gap-4">
      {title && (
        <h2 className={`text-2xl font-bold ${titleClassName}`}>
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