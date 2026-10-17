"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { OrderButton } from "@/components/OrderButton";
import { site } from "@/lib/site";
import { toLabel } from "@/lib/taxonomy";
import type { PublicCake } from "@/components/CakeCard";

export function CakeModal({ cake, onClose }: { cake: PublicCake; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const cakeUrl = `${site.url}/cake/${cake._id}`;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl bg-cream shadow-2xl sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink shadow hover:bg-white"
        >
          ✕
        </button>

        <div className="relative h-64 sm:h-full">
          <Image
            src={cake.imageUrl}
            alt={cake.title || "Cake"}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
          <h2 className="font-display text-2xl text-cocoa">{cake.title || "Custom bake"}</h2>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cocoa/60">
            {toLabel(cake.productType)}
          </p>

          {details.length > 0 && (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-blush/60 p-3 text-sm">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs text-cocoa/60">{d.label}</dt>
                  <dd className="font-medium text-cocoa">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {cake.occasion.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cocoa/60">
                Occasion
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cake.occasion.map((o) => (
                  <span key={o} className="rounded-full bg-blush px-3 py-1 text-xs text-cocoa">
                    {toLabel(o)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cake.style.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-cocoa/60">
                Style
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cake.style.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-rose/40 px-3 py-1 text-xs text-ink/70"
                  >
                    {toLabel(s)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cake.notes && <p className="mt-3 text-sm text-ink/70">{cake.notes}</p>}

          <p className="mt-6 text-sm text-ink/60">
            Every cake is custom-made to order — send us this design on WhatsApp and we&apos;ll
            quote you for your size, flavour and date.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <OrderButton message={orderMessage}>Order this cake</OrderButton>
            <Link href={`/cake/${cake._id}`} className="text-sm font-medium text-cocoa underline underline-offset-4">
              View full page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
