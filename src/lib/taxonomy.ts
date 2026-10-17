// Shared between the Mongoose model (server) and admin UI (client) — keep
// free of any server-only imports so it's safe to use from either.

export const OCCASIONS = [
  "birthday",
  "engagement-nikkah",
  "wedding",
  "eid",
  "umrah-hajj",
  "anniversary",
  "new-baby",
  "graduation",
  "retirement",
  "other",
] as const;

export const STYLES = [
  "minimalist-text",
  "floral",
  "character-licensed",
  "photo-print",
  "drip",
  "sports-hobby",
  "luxury-parody",
  "rustic-naked",
  "milestone-number",
] as const;

export const PRODUCT_TYPES = ["cake", "brownie", "cupcake"] as const;

export const labels: Record<string, string> = {
  "engagement-nikkah": "Engagement / Nikkah",
  "umrah-hajj": "Umrah / Hajj",
  "new-baby": "New Baby",
  "minimalist-text": "Minimalist / Text",
  "character-licensed": "Character / Licensed",
  "photo-print": "Photo Print",
  "sports-hobby": "Sports / Hobby",
  "luxury-parody": "Luxury Parody",
  "rustic-naked": "Rustic / Naked",
  "milestone-number": "Milestone / Number",
};

export function toLabel(value: string) {
  return labels[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
}
