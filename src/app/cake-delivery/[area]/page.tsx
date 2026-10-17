import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderButton } from "@/components/OrderButton";
import { areas, site } from "@/lib/site";

// Local landing pages — one per delivery area. Statically generated at build.
export function generateStaticParams() {
  return areas.map((a) => ({ area: a.slug }));
}

function getArea(slug: string) {
  return areas.find((a) => a.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/cake-delivery/[area]">): Promise<Metadata> {
  const area = getArea((await params).area);
  if (!area) return {};
  return {
    title: `Custom Cake Delivery in ${area.name}`,
    description: `Order custom birthday, wedding and theme cakes with delivery in ${area.name}. Rated ${site.rating.value}★ by ${site.rating.count}+ customers.`,
    alternates: { canonical: `/cake-delivery/${area.slug}` },
  };
}

export default async function AreaPage({
  params,
}: PageProps<"/cake-delivery/[area]">) {
  const area = getArea((await params).area);
  if (!area) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-cocoa">
        Custom cakes delivered in {area.name}
      </h1>
      <p className="mt-4 text-lg text-ink/80">{area.blurb}</p>
      <div className="mt-8">
        <OrderButton
          message={`Hi Crust & Fluff! I'd like to order a cake for delivery in ${area.name}.`}
        />
      </div>
    </main>
  );
}
