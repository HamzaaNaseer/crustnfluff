import Image from "next/image";
import { toLabel } from "@/lib/taxonomy";

export type PublicCake = {
  _id: string;
  title: string;
  imageUrl: string;
  productType: string;
  occasion: string[];
  style: string[];
  flavor?: string;
  weight?: string;
  servings?: string;
  price?: string;
  notes?: string;
};

export function CakeCard({
  cake,
  onOpen,
}: {
  cake: PublicCake;
  onOpen: (cake: PublicCake) => void;
}) {
  const primaryOccasion = cake.occasion[0];

  return (
    <button
      type="button"
      onClick={() => onOpen(cake)}
      className="group relative block w-full overflow-hidden rounded-2xl bg-blush text-left shadow-sm shadow-rose/10 transition hover:shadow-lg hover:shadow-rose/20"
    >
      <Image
        src={cake.imageUrl}
        alt={cake.title || "Cake"}
        width={600}
        height={750}
        className="h-auto w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-ink/0 to-transparent opacity-0 transition group-hover:opacity-100" />
      {primaryOccasion && (
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cocoa">
          {toLabel(primaryOccasion)}
        </span>
      )}
      {cake.title && (
        <span className="absolute inset-x-3 bottom-3 translate-y-2 text-sm font-medium text-cream opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          {cake.title}
        </span>
      )}
    </button>
  );
}
