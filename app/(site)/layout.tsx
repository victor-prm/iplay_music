// app/(site)/layout.tsx
import Header from "../_components/Header";
import Footer from "../_components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-col gap-12 container p-2 mx-auto py-16 h-full max-w-300">
        {children}
      </main>
      <Footer />
    </>
  );
}