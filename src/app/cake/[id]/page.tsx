import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { OrderButton } from "@/components/OrderButton";
import { connectToDatabase } from "@/lib/mongodb";
import { site } from "@/lib/site";
import { toLabel } from "@/lib/taxonomy";
import { CakeModel } from "@/models/Cake";

async function getCake(id: string) {
  await connectToDatabase();
  const cake = await CakeModel.findOne({ _id: id, active: true }).lean().catch(() => null);
  return cake;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cake = await getCake(id);
  if (!cake) return {};
  const title = cake.title || "Custom cake";
  return {
    title,
    description: `${title} — a custom bake by ${site.owner} at ${site.name}. Order yours on WhatsApp.`,
    alternates: { canonical: `/cake/${id}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      images: [{ url: cake.imageUrl }],
    },
  };
}

export default async function CakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cake = await getCake(id);
  if (!cake) notFound();

  const cakeUrl = `${site.url}/cake/${id}`;
  const orderMessage = cake.title
    ? `Hi Crust & Fluff! I'd love to order this: "${cake.title}" — ${cakeUrl}. Could you share pricing and timing?`
    : `Hi Crust & Fluff! I'd love to order this cake — ${cakeUrl}. Could you share pricing and timing?`;

  const details = [
    { label: "Flavour", value: cake.flavor },
    { label: "Weight", value: cake.weight },
    { label: "Servings", value: cake.servings },
    { label: "Price", value: cake.price },
  ].filter((d) => d.value);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl shadow-lg shadow-rose/20">
          <Image src={cake.imageUrl} alt={cake.title || "Cake"} fill priority className="object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cocoa/60">
            {toLabel(cake.productType)}
          </p>
          <h1 className="mt-1 font-display text-3xl text-cocoa">{cake.title || "Custom bake"}</h1>

          {details.length > 0 && (
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-blush/60 p-4 text-sm">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs text-cocoa/60">{d.label}</dt>
                  <dd className="font-medium text-cocoa">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {cake.occasion?.length > 0 && (
            <div className="mt-5">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cocoa/60">
                Occasion
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cake.occasion.map((o: string) => (
                  <span key={o} className="rounded-full bg-blush px-3 py-1 text-xs text-cocoa">
                    {toLabel(o)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cake.style?.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cocoa/60">
                Style
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cake.style.map((s: string) => (
                  <span key={s} className="rounded-full border border-rose/40 px-3 py-1 text-xs text-ink/70">
                    {toLabel(s)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cake.notes && <p className="mt-5 text-sm text-ink/70">{cake.notes}</p>}

          <p className="mt-6 text-sm text-ink/60">
            Every cake is custom-made to order — send us this exact design on WhatsApp and
            we&apos;ll quote you for your size, flavour and date.
          </p>

          <div className="mt-6">
            <OrderButton message={orderMessage}>Order this cake</OrderButton>
          </div>
        </div>
      </div>
    </main>
  );
}
