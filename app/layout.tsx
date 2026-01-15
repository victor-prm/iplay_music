import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | iPlayMusic",
    default: "iPlayMusic"
  },
  description: "The world's most innovative personal music player",
};

import Header from "./_components/Header";
import Footer from "./_components/Footer";

//Static fonts
const poppins = Poppins({
  weight: ["300", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

//Variable fonts
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${poppins.variable} ${dmSans.variable} antialiased`}
      >
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
