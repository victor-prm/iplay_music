import "../icon.svg"

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[linear-gradient(to_bottom_left,var(--color-iplay-pink),var(--color-iplay-coral))]">
            <main className="flex min-h-screen flex-col gap-12 container mx-auto max-w-300 items-center justify-center">
                {children}
            </main>
        </div>
    );
}