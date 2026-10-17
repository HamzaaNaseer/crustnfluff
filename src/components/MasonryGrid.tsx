import type { ReactNode } from "react";

// Pinterest-style masonry using CSS columns — no JS, works with SSR,
// and keeps the gallery fully crawlable.
export function MasonryGrid({ children }: { children: ReactNode }) {
  return (
    <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {children}
    </div>
  );
}
