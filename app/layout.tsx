// app/layout.tsx
import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | iPlayMusic",
    default: "iPlayMusic",
  },
  description: "The world's most innovative personal music player",
};

// Static fonts
const poppins = Poppins({
  weight: ["300", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

// Variable fonts
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-[linear-gradient(to_bottom_left,var(--color-iplay-black),var(--color-iplay-night))]"
    >
      <body
        className={`
          ${poppins.variable}
          ${dmSans.variable}
          antialiased
          text-iplay-white
          min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}