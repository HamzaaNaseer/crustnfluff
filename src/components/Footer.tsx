import Link from "next/link";
import { areas, site, whatsappLink } from "@/lib/site";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-rose/15 bg-blush/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl text-cocoa">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-ink/70">{site.description}</p>
          <p className="mt-4 text-sm text-ink/60">By {site.owner}, B-17, Islamabad</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            We deliver to
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/cake-delivery/${a.slug}`} className="hover:text-cocoa">
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cocoa/70">
            Get in touch
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-cocoa">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cocoa">
                Instagram
              </a>
            </li>
            <li>
              <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cocoa">
                Find us on Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rose/15 px-4 py-5 text-center text-xs text-ink/50">
        © {currentYear} {site.name}. Home-baked in B-17, Islamabad.
      </div>
    </footer>
  );
}
