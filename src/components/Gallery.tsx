"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CakeCard, type PublicCake } from "@/components/CakeCard";
import { CakeModal } from "@/components/CakeModal";
import { MasonryGrid } from "@/components/MasonryGrid";
import { PlaceholderArt } from "@/components/PlaceholderArt";
import { categories } from "@/lib/site";
import { toLabel } from "@/lib/taxonomy";

const samplePlaceholders = [
  { id: "c1", category: "cakes", height: 320 },
  { id: "c2", category: "cakes", height: 260 },
  { id: "c3", category: "cakes", height: 300 },
  { id: "c4", category: "cakes", height: 240 },
];

const productTypeTabs = ["all", ...categories.map((c) => c.slug)] as const;

type ApiResponse = {
  cakes: PublicCake[];
  total: number;
  hasMore: boolean;
  availableOccasions?: string[];
};

export function Gallery({
  limit,
  showFilters = false,
  viewAllHref,
  initialOccasion = "all",
}: {
  /** Preview mode: fetch a single page of this size, no infinite scroll. */
  limit?: number;
  showFilters?: boolean;
  viewAllHref?: string;
  initialOccasion?: string;
}) {
  const [productType, setProductType] = useState<(typeof productTypeTabs)[number]>("all");
  const [occasion, setOccasion] = useState<string>(initialOccasion);
  const [availableOccasions, setAvailableOccasions] = useState<string[]>([]);
  const [cakes, setCakes] = useState<PublicCake[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState<PublicCake | null>(null);

  const pageSize = limit ?? 24;

  const fetchPage = useCallback(
    async (pageNum: number) => {
      const params = new URLSearchParams();
      if (productType !== "all") params.set("productType", productType);
      if (occasion !== "all") params.set("occasion", occasion);
      params.set("page", String(pageNum));
      params.set("limit", String(pageSize));
      const res = await fetch(`/api/cakes?${params.toString()}`);
      return (await res.json()) as ApiResponse;
    },
    [productType, occasion, pageSize],
  );

  // Reset and fetch first page whenever filters change.
  useEffect(() => {
    let cancelled = false;
    setCakes(null);
    setPage(0);
    fetchPage(0)
      .then((data) => {
        if (cancelled) return;
        setCakes(data.cakes);
        setTotal(data.total);
        setHasMore(limit ? false : data.hasMore);
        if (data.availableOccasions) setAvailableOccasions(data.availableOccasions);
      })
      .catch(() => {
        if (!cancelled) setCakes([]);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType, occasion]);

  // Infinite scroll sentinel (full gallery only, not preview mode).
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (limit || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          fetchPage(nextPage)
            .then((data) => {
              setCakes((cur) => (cur ? [...cur, ...data.cakes] : data.cakes));
              setPage(nextPage);
              setHasMore(data.hasMore);
            })
            .finally(() => setLoadingMore(false));
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [limit, hasMore, loadingMore, page, fetchPage]);

  if (!cakes || cakes.length === 0) {
    const placeholderVisible =
      productType === "all" ? samplePlaceholders : samplePlaceholders.filter((i) => i.category === productType);
    const isLoading = cakes === null;
    return (
      <div>
        {showFilters && categories.length > 1 && (
          <FilterTabs productType={productType} setProductType={setProductType} />
        )}
        {isLoading ? null : (
          <MasonryGrid>
            {placeholderVisible.map((item) => {
              const label = categories.find((c) => c.slug === item.category)?.name;
              return (
                <div key={item.id} className="relative overflow-hidden rounded-2xl">
                  <PlaceholderArt category={item.category} className="w-full" style={{ height: item.height }} />
                  <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cocoa">
                    {label}
                  </span>
                </div>
              );
            })}
          </MasonryGrid>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 space-y-3">
        {categories.length > 1 && <FilterTabs productType={productType} setProductType={setProductType} />}
        {showFilters && availableOccasions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOccasion("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                occasion === "all" ? "bg-ink text-cream" : "border border-rose/30 text-ink/60 hover:bg-blush"
              }`}
            >
              All occasions
            </button>
            {availableOccasions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOccasion(o)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  occasion === o ? "bg-ink text-cream" : "border border-rose/30 text-ink/60 hover:bg-blush"
                }`}
              >
                {toLabel(o)}
              </button>
            ))}
          </div>
        )}
      </div>

      <MasonryGrid>
        {cakes.map((cake) => (
          <CakeCard key={cake._id} cake={cake} onOpen={setSelected} />
        ))}
      </MasonryGrid>

      {!limit && hasMore && (
        <div ref={sentinelRef} className="mt-8 flex justify-center py-4">
          <span className="text-sm text-ink/50">Loading more…</span>
        </div>
      )}

      {limit && total > cakes.length && viewAllHref && (
        <div className="mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-block rounded-full border border-cocoa/30 px-6 py-3 text-sm font-medium text-cocoa hover:bg-blush"
          >
            View full gallery ({total})
          </Link>
        </div>
      )}

      {selected && <CakeModal cake={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterTabs({
  productType,
  setProductType,
}: {
  productType: string;
  setProductType: (v: (typeof productTypeTabs)[number]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {productTypeTabs.map((slug) => {
        const label = slug === "all" ? "All" : categories.find((c) => c.slug === slug)?.name;
        const isActive = productType === slug;
        return (
          <button
            key={slug}
            type="button"
            onClick={() => setProductType(slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive ? "bg-cocoa text-cream" : "border border-rose/40 text-ink/80 hover:bg-blush"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
