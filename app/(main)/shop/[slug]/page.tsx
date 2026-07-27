import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getListingBySlug,
  getListingSlugs,
  getListings,
  shopUrl,
} from "@/lib/etsy";
import { Section, Eyebrow } from "@/components/Section";
import { AddToProjectButton } from "@/components/AddToProjectButton";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return { title: "Not found — Encore Woodworx" };
  return {
    title: `${listing.title} — Encore Woodworx`,
    description: listing.descriptionPlain.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.descriptionPlain.slice(0, 160),
      images: listing.imageUrl ? [{ url: listing.imageUrl }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const all = await getListings();
  const more = all.filter((l) => l.id !== listing.id).slice(0, 3);

  const paragraphs = listing.descriptionPlain
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Section className="!pt-12 md:!pt-16">
        <nav className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)] mb-8">
          <Link href="/" className="hover:text-[color:var(--accent)]">Home</Link>
          <span className="mx-2 opacity-50">/</span>
          <Link href="/shop" className="hover:text-[color:var(--accent)]">Shop</Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-[color:var(--foreground)]">{listing.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <div
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
              style={{ background: "var(--surface-media)" }}
            >
              {listing.imageUrl ? (
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : null}
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Photo via Etsy listing · live preview
            </p>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.2em] ${
                  listing.madeToOrder
                    ? "bg-[color:var(--accent)]/10 text-[color:var(--accent-deep)]"
                    : "bg-[color:var(--forest)]/10 text-[color:var(--forest)]"
                }`}
              >
                {listing.madeToOrder ? "Made to order" : "Ready to ship"}
              </span>
              <Eyebrow>From the shop</Eyebrow>
            </div>
            <h1 className="font-display text-4xl md:text-5xl mt-1 leading-[1.05]">
              {listing.title}
            </h1>
            <p className="mt-6 font-display text-3xl text-[color:var(--accent-deep)]">
              {listing.priceLabel}
            </p>

            <div className="mt-8 space-y-3">
              {listing.madeToOrder ? (
                <>
                  <AddToProjectButton
                    id={listing.id}
                    slug={listing.slug}
                    title={listing.title}
                    priceLabel={listing.priceLabel}
                    imageUrl={listing.imageUrl}
                  />
                  <a
                    href={listing.etsyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost w-full"
                  >
                    Or buy this exact piece on Etsy ↗
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={listing.etsyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full"
                  >
                    Buy on Etsy ↗
                  </a>
                  <Link href="/contact" className="btn btn-ghost w-full">
                    Ask about a custom version
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 rounded-xl bg-[color:var(--surface)] border border-[color:var(--border)] p-5 text-sm text-[color:var(--muted)] leading-relaxed">
              {listing.madeToOrder ? (
                <>
                  <p className="font-semibold text-[color:var(--foreground)] mb-2">
                    How &ldquo;Add to Project&rdquo; works
                  </p>
                  <ul className="space-y-1 list-disc list-inside marker:text-[color:var(--accent)]">
                    <li>Add as many pieces as you&apos;re considering — no commitment</li>
                    <li>Send the whole list as one inquiry; I reply with options &amp; a quote</li>
                    <li>Final order goes through Etsy for secure checkout &amp; buyer protection</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-semibold text-[color:var(--foreground)] mb-2">
                    Why checkout on Etsy?
                  </p>
                  <ul className="space-y-1 list-disc list-inside marker:text-[color:var(--accent)]">
                    <li>Secure payments &amp; buyer protection</li>
                    <li>Real reviews from past customers</li>
                    <li>Tracked shipping straight from the workshop</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {paragraphs.length > 0 && (
          <div className="mt-20 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3">
              <Eyebrow>Details</Eyebrow>
              <h2 className="font-display text-3xl mt-3">About this piece</h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-5 prose prose-lg max-w-none">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[color:var(--foreground)]/85 leading-relaxed mb-5 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}
      </Section>

      {more.length > 0 && (
        <Section className="!pt-0">
          <div className="border-t border-[color:var(--border)] pt-16">
            <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
              <h2 className="font-display text-3xl md:text-4xl">More from the workshop</h2>
              <Link href="/shop" className="text-sm font-medium underline underline-offset-4">
                See all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {more.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-all"
                >
                  <div className="relative aspect-square" style={{ background: "var(--surface-media)" }}>
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg leading-tight line-clamp-2">{p.title}</h3>
                    <p className="mt-2 text-sm font-semibold">{p.priceLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      <a
        href={shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sr-only"
      >
        Etsy shop home
      </a>
    </>
  );
}
