import Link from "next/link";
import { OrderButton } from "@/components/OrderButton";
import { site } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-rose/15 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl text-cocoa">
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 sm:flex">
          <Link href="/gallery" className="hover:text-cocoa">
            Gallery
          </Link>
          <span className="inline-flex cursor-not-allowed items-center gap-1.5 text-ink/40">
            Menu
            <span className="rounded-full bg-blush px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cocoa/70">
              Soon
            </span>
          </span>
          <Link href="/#reviews" className="hover:text-cocoa">
            Reviews
          </Link>
        </nav>
        <OrderButton>
          <span className="hidden sm:inline">Order on </span>WhatsApp
        </OrderButton>
      </div>
    </header>
  );
}
