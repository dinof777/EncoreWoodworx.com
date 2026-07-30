/**
 * The single source of truth for the shop's facts.
 *
 * Both the /services page and the LocalBusiness structured data read from here, so the
 * two cannot drift — a service renamed on the page is renamed in what Google is told.
 *
 * Everything here is something the site publicly states. There is deliberately no street
 * address or phone number: the site publishes neither, and inventing them for structured
 * data would be feeding Google claims the business has not made.
 */

export type Service = { title: string; body: string };

export const SERVICES: Service[] = [
  {
    title: "Custom Wood Tables",
    body:
      "Dining, conference, kitchen, and side tables. Solid hardwood, butcher block, or live-edge slabs. Any size, any base.",
  },
  {
    title: "Epoxy River Tables",
    body:
      "Live-edge slabs paired with deep-pour epoxy in custom tints. Centerpiece pieces that take light beautifully.",
  },
  {
    title: "Live-Edge Furniture",
    body:
      "Desks, benches, headboards, consoles. Hand-selected slabs, finished food-safe and ready for daily use.",
  },
  {
    title: "Sliding Barn Doors",
    body:
      "Hand-built barn doors with blacksmithed hardware. Reclaimed wood, painted, or stained to match the space.",
  },
  {
    title: "Wood & Steel Stair Railings",
    body:
      "Welded steel and hardwood railings — modern industrial or rustic farmhouse, fabricated and installed in-house.",
  },
  {
    title: "Custom Countertops",
    body:
      "Butcher block, end-grain, and live-edge counters for kitchens, bars, and islands. Sealed for the way you actually cook.",
  },
  {
    title: "Lamps & Lighting",
    body:
      "Wood-and-Edison-bulb pendants, sconces, and table lamps — UL-rated wiring, finished by hand.",
  },
  {
    title: "Built-Ins & Organization",
    body:
      "Mudroom benches, closets, shelving, kids&apos; rooms. Storage designed around how your family lives, not a catalog.",
  },
];

export const BUSINESS = {
  name: "Encore Woodworx",
  legalName: "Encore Woodworx, LLC",
  url: "https://encorewoodworx.com",
  description:
    "One workshop, one pair of hands. Bespoke epoxy river tables, live-edge furniture, " +
    "sliding barn doors, custom countertops and wood-and-steel railings — every piece " +
    "milled, joined and finished by hand in Fort Lauderdale, Florida.",
  areaServed: ["Fort Lauderdale", "Broward County", "South Florida"],
  /** Mirrors the hours published on /contact. */
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
    { days: ["Saturday", "Sunday"], opens: "10:00", closes: "18:00" },
  ],
  sameAs: [
    "https://www.instagram.com/dinof777/",
    "https://www.facebook.com/dino.flora",
    "https://florabrofurnishings.etsy.com",
  ],
} as const;
