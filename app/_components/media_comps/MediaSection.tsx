import { ReactNode } from "react";
import LoadingSpinner from "../LoadingSpinner";

interface MediaSectionProps {
  title?: string;
  titleClassName?: string;
  variant?: "vertical" | "horizontal";
  children: ReactNode;
  isLoading?: boolean; // new prop
}

export default function MediaSection({
  title,
  titleClassName = "",
  children,
  isLoading = false,
}: MediaSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      {title && (
        <h2 className={`text-2xl font-bold font-poppins ${titleClassName} flex items-center gap-2`}>
          {title}
          {isLoading && (
            <LoadingSpinner/>
          )}
        </h2>
      )}
      {children}
    </section>
  );
}