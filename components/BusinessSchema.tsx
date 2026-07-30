import { BUSINESS, SERVICES } from "@/lib/business";

/**
 * LocalBusiness structured data — how the site tells Google what this business is,
 * independently of the Google Business Profile.
 *
 * Built from lib/business.ts so it cannot drift from the /services page.
 *
 * Deliberately omits `address` and `telephone`: the site publishes neither, and Google's
 * rich-result guidance wants a real postal address. A service-area business without a
 * storefront is a legitimate shape — `areaServed` carries that — but be aware the absence
 * of an address limits which rich results this can qualify for. If a public address or
 * phone ever exists, add them here and the markup gets materially stronger.
 */
export function BusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    description: BUSINESS.description,
    image: `${BUSINESS.url}/logo.png`,
    priceRange: "$$",
    areaServed: BUSINESS.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: BUSINESS.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: [...BUSINESS.sameAs],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Commission types",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.body },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Content is built from local constants, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
