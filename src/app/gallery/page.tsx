import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Browse every custom cake ${site.owner} has baked — filter by occasion and order your favourite on WhatsApp.`,
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string }>;
}) {
  const { occasion } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl text-cocoa sm:text-5xl">The Gallery</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink/70">
          Every cake is custom and one-of-a-kind. Tap any photo to see the details and order
          something similar on WhatsApp.
        </p>
      </div>
      <Gallery showFilters initialOccasion={occasion || "all"} />
    </main>
  );
}
