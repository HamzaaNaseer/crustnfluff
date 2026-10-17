"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

type Review = {
  _id: string;
  name: string;
  area: string;
  text: string;
  link: string;
};

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, []);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section aria-labelledby="reviews" id="reviews" className="mb-20">
      <div className="mb-6 flex items-end justify-between">
        <h2 id="reviews" className="font-display text-2xl text-cocoa">
          Loved by our customers
        </h2>
        <p className="text-sm text-ink/60">
          ★ {site.rating.value} · {site.rating.count} Google reviews
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {reviews.map((r) => (
          <figure
            key={r._id}
            className="flex flex-col rounded-3xl border border-rose/25 bg-white/60 p-6 shadow-sm shadow-rose/10"
          >
            <div className="text-rose" aria-hidden>
              ★★★★★
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-medium text-cocoa">
              {r.name}
              {r.area && <span className="block text-xs font-normal text-ink/50">{r.area}</span>}
            </figcaption>
            {r.link && (
              <a
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-cocoa underline underline-offset-4"
              >
                See on Google ↗
              </a>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
