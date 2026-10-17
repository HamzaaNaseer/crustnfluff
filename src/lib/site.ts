// Single source of truth for business details. Used by metadata, JSON-LD,
// the sitemap and the UI, so NAP (name/address/phone) stays consistent
// with the Google Business Profile — that consistency matters for local SEO.

export const site = {
  name: "Crust & Fluff",
  url: "https://crustnfluff.com",
  tagline: "Custom cakes in Islamabad",
  description:
    "Home-based custom cake studio in B-17, Islamabad. Birthday, wedding and theme cakes delivered across Islamabad, Rawalpindi, Wah Cantt and Taxila.",
  owner: "Zainab",
  phone: "+923241925872",
  whatsapp: "923241925872", // digits only, used for wa.me links
  instagram: "https://www.instagram.com/crustnfluff/",
  googleMapsUrl: "https://maps.app.goo.gl/dvYQWxkfRtriwMSY8",
  address: {
    streetAddress: "B-17",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    postalCode: "44000",
    addressCountry: "PK",
  },
  geo: { latitude: 33.6936, longitude: 72.8203 }, // approx B-17; replace with exact pin
  rating: { value: 4.9, count: 116 },
} as const;

export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

// Drives the gallery filter tabs. Brownies & cupcakes will be added back
// here once we're ready to feature them — the gallery/admin already support
// those product types, this list just controls what's publicly promoted.
export const categories: Category[] = [
  { slug: "cakes", name: "Cakes", blurb: "Custom birthday, wedding & theme cakes." },
];

export type Area = {
  slug: string;
  name: string;
  blurb: string;
};

// Each area gets its own landing page (/cake-delivery/[slug]) — these rank for
// "cake delivery in <area>" searches and double as ad landing pages.
export const areas: Area[] = [
  { slug: "b-17-islamabad", name: "B-17 Islamabad", blurb: "Our home kitchen is right here in B-17 — same-day pickup and the fastest delivery." },
  { slug: "islamabad", name: "Islamabad", blurb: "Custom cakes delivered across Islamabad sectors, from G-13 to DHA." },
  { slug: "rawalpindi", name: "Rawalpindi", blurb: "Birthday and celebration cakes delivered across Rawalpindi." },
  { slug: "wah-cantt", name: "Wah Cantt", blurb: "Freshly baked custom cakes delivered to Wah Cantt." },
  { slug: "taxila", name: "Taxila", blurb: "Custom cakes and treats delivered to Taxila." },
];

export function whatsappLink(message = "Hi Crust & Fluff! I'd like to order a cake.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
