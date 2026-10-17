import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/hero/Hero";
import { Testimonials } from "@/components/Testimonials";
import { connectToDatabase } from "@/lib/mongodb";
import { areas } from "@/lib/site";
import { OCCASIONS, toLabel } from "@/lib/taxonomy";
import { CakeModel } from "@/models/Cake";

// Homepage reads live cake data (hero order, occasion showcase) on every
// request, so it can't be statically prerendered — render it on demand.
export const instant = false;

async function getHeroCakes() {
  await connectToDatabase();
  const cakes = await CakeModel.find({ active: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(16)
    .select("imageUrl title")
    .lean();
  return cakes.map((c) => ({ url: c.imageUrl as string, title: (c.title as string) || "Cake" }));
}

async function getOccasionShowcase() {
  await connectToDatabase();
  const results = await Promise.all(
    OCCASIONS.map(async (occasion) => {
      const cake = await CakeModel.findOne({ active: true, occasion })
        .sort({ order: 1 })
        .select("imageUrl")
        .lean();
      return cake ? { occasion, imageUrl: cake.imageUrl as string } : null;
    }),
  );
  return results.filter((r) => r !== null);
}

export default async function Home() {
  await connection();
  const [heroCakes, occasionShowcase] = await Promise.all([getHeroCakes(), getOccasionShowcase()]);

  return (
    <main className="w-full">
      <Hero cakes={heroCakes} />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
        {/* Gallery */}
        <section aria-labelledby="gallery" id="gallery" className="mb-20">
          <h2 id="gallery" className="mb-6 font-display text-2xl text-cocoa">
            Recent bakes
          </h2>
          <Gallery limit={8} viewAllHref="/gallery" />
        </section>

        {/* Browse by occasion */}
        {occasionShowcase.length > 0 && (
          <section aria-labelledby="occasions" className="mb-20">
            <h2 id="occasions" className="mb-6 font-display text-2xl text-cocoa">
              Shop by occasion
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {occasionShowcase.map(({ occasion, imageUrl }) => (
                <Link
                  key={occasion}
                  href={`/gallery?occasion=${occasion}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl"
                >
                  <Image
                    src={imageUrl}
                    alt={toLabel(occasion)}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent transition group-hover:from-ink/90" />
                  <span className="absolute inset-x-0 bottom-0 p-4 font-display text-lg text-cream">
                    {toLabel(occasion)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Testimonials />

        {/* Delivery areas */}
        <section aria-labelledby="areas" id="areas">
          <h2 id="areas" className="mb-4 font-display text-2xl text-cocoa">
            We deliver to
          </h2>
          <ul className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/cake-delivery/${a.slug}`}
                  className="inline-block rounded-full border border-rose/40 px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:bg-blush hover:shadow-sm"
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
