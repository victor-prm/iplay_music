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
      <main className="container p-2 mx-auto py-13 h-full">
        {children}
      </main>
      <Footer />
    </>
  );
}