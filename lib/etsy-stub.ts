export type EtsyListing = {
  id: string;
  title: string;
  slug: string;
  priceUsd: number;
  imageUrl: string;
  etsyUrl: string;
  description: string;
};

export const stubListings: EtsyListing[] = [
  {
    id: "930605061",
    title: "Custom Epoxy River Desks",
    slug: "custom-epoxy-river-desks",
    priceUsd: 999,
    imageUrl:
      "https://i.etsystatic.com/13481182/r/il/18859d/4617151742/il_570xN.4617151742_v7y8.jpg",
    etsyUrl:
      "https://www.etsy.com/listing/930605061/custom-epoxy-river-desks-home-office",
    description:
      "Made-to-order live-edge slab desk with deep-pour epoxy in custom tints. Each piece is one-of-a-kind.",
  },
  {
    id: "1786177045",
    title: "Custom Epoxy Coffee Tables",
    slug: "custom-epoxy-coffee-tables",
    priceUsd: 900,
    imageUrl:
      "https://i.etsystatic.com/13481182/r/il/b8a244/6235150326/il_570xN.6235150326_toai.jpg",
    etsyUrl:
      "https://www.etsy.com/listing/1786177045/custom-epoxy-coffee-tables-cookies",
    description:
      "Customizable epoxy resin coffee tables. Cookies, river pours, geode patterns — your call.",
  },
  {
    id: "916697258",
    title: "Hot Sauce Bottle Display Rack",
    slug: "hot-sauce-display-rack",
    priceUsd: 289,
    imageUrl:
      "https://i.etsystatic.com/13481182/r/il/0b9a6b/6233648132/il_570xN.6233648132_oioz.jpg",
    etsyUrl:
      "https://www.etsy.com/listing/916697258/hot-sauce-bottle-display-rack-wood-iron",
    description:
      "Handmade wood-and-steel rack. Made-to-order with a 1–2 week shop lead time.",
  },
  {
    id: "923608204",
    title: "Wall Hanging Skateboard Rack",
    slug: "skateboard-rack-display",
    priceUsd: 129,
    imageUrl:
      "https://i.etsystatic.com/13481182/r/il/94f083/2791745276/il_570xN.2791745276_6st3.jpg",
    etsyUrl:
      "https://www.etsy.com/listing/923608204/wall-hanging-skateboard-rack-display",
    description:
      "Custom blacksmith-designed steel hooks for displaying 1–2 skateboards on the wall.",
  },
  {
    id: "916690876",
    title: "Christmas Jingle Bell Conversation Piece",
    slug: "christmas-jingle-bell-piece",
    priceUsd: 28.99,
    imageUrl:
      "https://i.etsystatic.com/13481182/r/il/2925ba/2751985076/il_570xN.2751985076_nyjo.jpg",
    etsyUrl:
      "https://www.etsy.com/listing/916690876/christmas-jingle-bell-conversation-piece",
    description: "A handcrafted holiday conversation piece for the mantel.",
  },
  {
    id: "916707556",
    title: "Hat Pencil Holder",
    slug: "hat-pencil-holder",
    priceUsd: 8.99,
    imageUrl:
      "https://i.etsystatic.com/13481182/r/il/44e38c/2799724707/il_570xN.2799724707_mrg3.jpg",
    etsyUrl:
      "https://www.etsy.com/listing/916707556/hat-pencil-holder-baseball-cap-with",
    description:
      "Handmade green cotton cap with metal clip for holding pencils. Ready to ship.",
  },
];
