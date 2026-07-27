import { XMLParser } from "fast-xml-parser";

export type ListingKind = "woodworking" | "apparel" | "other";

export type EtsyListing = {
  id: string;
  title: string;
  slug: string;
  priceUsd: number | null;
  priceLabel: string;
  imageUrl: string | null;
  etsyUrl: string;
  description: string;
  descriptionPlain: string;
  publishedAt: string;
  kind: ListingKind;
  madeToOrder: boolean;
};

const SHOP = process.env.ETSY_SHOP_NAME || "florabrofurnishings";
const RSS_URL = `https://www.etsy.com/shop/${SHOP}/rss`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function idFromLink(link: string): string {
  const m = link.match(/\/listing\/(\d+)/);
  return m ? m[1] : link;
}

function priceFromText(text: string): { value: number | null; label: string } {
  const dollar = text.match(/\$\s?([\d,]+(?:\.\d{1,2})?)/);
  const usd = text.match(/([\d,]+(?:\.\d{1,2})?)\s?USD/i);
  const m = dollar ?? usd;
  if (!m) return { value: null, label: "Made to order" };
  const value = Number(m[1].replace(/,/g, ""));
  return {
    value,
    label: `$${value.toLocaleString(undefined, {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`,
  };
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripHtml(html: string): string {
  return decodeEntities(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>(\n)?/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Etsy's RSS embeds the 570px-wide variant, which upscales visibly in the catalogue
 * cards (they render ~382 CSS px, so 764 device px at DPR 2). The size is just a token
 * in the path, and Etsy serves several — swap in a variant large enough to stay sharp.
 * next/image resizes down from this to whatever the layout actually needs, so the only
 * cost is fetch bandwidth at build/revalidate time, not payload to the visitor.
 */
const ETSY_IMAGE_VARIANT = "il_1588xN";

function upgradeEtsyImage(url: string): string {
  return url.replace(/\/il_\d+x[N\d]+\./i, `/${ETSY_IMAGE_VARIANT}.`);
}

function firstImageUrl(html: string): string | null {
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? upgradeEtsyImage(m[1]) : null;
}

function classify(title: string, description: string): ListingKind {
  const t = `${title} ${description}`.toLowerCase();
  // Apparel signals — t-shirts, hoodies, etc.
  if (/\b(t-?shirt|tshirt|\btee\b|hoodie|sweatshirt|sweater|tank top|long sleeve)\b/.test(t)) {
    return "apparel";
  }
  // Cap/hat-style products — visually apparel even if they're "carpenter accessories"
  if (/\b(baseball cap|trucker hat|beanie)\b/.test(t)) {
    return "other";
  }
  return "woodworking";
}

function isMadeToOrder(kind: ListingKind, title: string, description: string): boolean {
  if (kind !== "woodworking") return false;
  const t = `${title} ${description}`.toLowerCase();
  return /\b(custom|made[ -]?to[ -]?order|bespoke|live[ -]?edge|epoxy river|barn door|stair railing|river table)\b/.test(t);
}

function normalize(item: Record<string, unknown>): EtsyListing {
  const title = decodeEntities(String(item.title ?? "")).trim();
  const link = String(item.link ?? "").split("?")[0];
  const id = idFromLink(link);
  const descRaw =
    typeof item.description === "object" && item.description !== null
      ? String((item.description as { __cdata?: string }).__cdata ?? "")
      : String(item.description ?? "");
  const { value, label } = priceFromText(descRaw);
  const imageUrl = firstImageUrl(descRaw);
  const descriptionPlain = stripHtml(descRaw)
    .replace(/[\d,]+(?:\.\d{1,2})?\s?USD/gi, "")
    .replace(/\$\s?[\d,]+(?:\.\d{1,2})?/g, "")
    .trim();
  const kind = classify(title, descriptionPlain);
  return {
    id,
    title,
    slug: slugify(title) || id,
    priceUsd: value,
    priceLabel: label,
    imageUrl,
    etsyUrl: link,
    description: descRaw,
    descriptionPlain,
    publishedAt: String(item.pubDate ?? ""),
    kind,
    madeToOrder: isMadeToOrder(kind, title, descriptionPlain),
  };
}

export async function getListings(): Promise<EtsyListing[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600, tags: ["etsy-listings"] },
      headers: { "user-agent": "EncoreWoodworxBot/1.0 (+https://encorewoodworx.com)" },
    });
    if (!res.ok) {
      console.warn("[etsy] RSS fetch failed", res.status);
      return [];
    }
    const xml = await res.text();
    const parsed = parser.parse(xml) as {
      rss?: { channel?: { item?: Record<string, unknown> | Record<string, unknown>[] } };
    };
    const items = parsed.rss?.channel?.item;
    const list = Array.isArray(items) ? items : items ? [items] : [];
    const normalized = list.map(normalize);
    const seen = new Map<string, number>();
    for (const l of normalized) {
      const count = seen.get(l.slug) ?? 0;
      seen.set(l.slug, count + 1);
    }
    return normalized.map((l) =>
      (seen.get(l.slug) ?? 1) > 1 ? { ...l, slug: `${l.slug}-${l.id}` } : l,
    );
  } catch (e) {
    console.warn("[etsy] RSS parse error", e);
    return [];
  }
}

export async function getListingBySlug(slug: string): Promise<EtsyListing | null> {
  const all = await getListings();
  return all.find((l) => l.slug === slug) ?? null;
}

export async function getListingSlugs(): Promise<string[]> {
  const all = await getListings();
  return all.map((l) => l.slug);
}

export const shopUrl = `https://${SHOP}.etsy.com`;
