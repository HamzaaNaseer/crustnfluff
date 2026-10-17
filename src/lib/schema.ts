import { areas, site } from "./site";

// schema.org Bakery (a LocalBusiness subtype). Helps Google show the
// business in local results with rating stars and service area.
export function bakerySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${site.url}/#bakery`,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.phone,
    image: `${site.url}/og.jpg`, // TODO: add public/og.jpg (best cake photo, 1200x630)
    priceRange: "PKR",
    address: { "@type": "PostalAddress", ...site.address },
    geo: { "@type": "GeoCoordinates", ...site.geo },
    areaServed: areas.map((a) => ({ "@type": "City", name: a.name })),
    sameAs: [site.instagram, site.googleMapsUrl],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
    },
  };
}
