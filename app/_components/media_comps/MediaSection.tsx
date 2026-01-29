import { ReactNode } from "react";

interface MediaSectionProps {
  title?: string;
  titleClassName?: string;
  variant?: "vertical" | "horizontal";
  children: ReactNode;
}

export default function MediaSection({
  title,
  titleClassName = "",
  children,
}: MediaSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      {title && (
        <h2 className={`text-2xl font-bold font-poppins ${titleClassName}`}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}