import Image from "next/image";
import Link from "next/link";
import { getListings, type EtsyListing } from "@/lib/etsy";
import { Section, SectionHeader, Eyebrow } from "@/components/Section";

export const revalidate = 3600;

export const metadata = {
  title: "Shop — Encore Woodworx",
  description:
    "Handcrafted wooden pieces, made to order. Browse the workshop's current collection — checkout happens securely on Etsy.",
};

export default async function ShopPage() {
  const listings = await getListings();
  const woodworking = listings.filter((l) => l.kind === "woodworking");
  const extras = listings.filter((l) => l.kind !== "woodworking");

  return (
    <>
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, rgba(201,180,140,0.55), transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32 relative">
          <p className="eyebrow !text-[color:var(--accent-soft)]">The Workshop · Live</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-4xl leading-[1.02]">
            In the workshop right now.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--surface)]/80 leading-relaxed">
            Every piece is hand-built in my workshop. Browse the current catalogue below — click
            through any piece for the full story.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#catalogue" className="btn btn-primary">
              Browse the catalogue ↓
            </a>
            <Link href="/contact" className="btn btn-light">
              Commission a piece
            </Link>
          </div>
        </div>
      </section>

      <Section>
        {listings.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div id="catalogue" className="scroll-mt-28">
              <SectionHeader
                eyebrow={`${woodworking.length} woodworking pieces`}
                title="Browse the catalogue."
              />
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {woodworking.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>

            {extras.length > 0 && (
              <div className="mt-24 pt-16 border-t border-[color:var(--border)]">
                <div className="flex items-end justify-between gap-6 flex-wrap">
                  <SectionHeader
                    eyebrow="Also in the shop"
                    title="Apparel & accessories."
                    intro={`The "Stad" tees come from a side project of mine — Live Blended. There's a story behind why a wood shop sells these.`}
                  />
                  <Link
                    href="/live-blended"
                    className="text-sm font-semibold text-[color:var(--accent-deep)] underline underline-offset-4 hover:text-[color:var(--accent)]"
                  >
                    Read the story →
                  </Link>
                </div>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {extras.map((p) => (
                    <ProductCard key={p.id} p={p} muted />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}

function ProductCard({ p, muted = false }: { p: EtsyListing; muted?: boolean }) {
  return (
    <Link
      href={`/shop/${p.slug}`}
      className={`group block rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--accent)] hover:shadow-xl transition-all ${
        muted ? "opacity-90 hover:opacity-100" : ""
      }`}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: "var(--surface-media)" }}
      >
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <Eyebrow>{p.kind === "apparel" ? "Apparel" : p.kind === "other" ? "Accessory" : "From the shop"}</Eyebrow>
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-[0.18em] ${
              p.madeToOrder
                ? "bg-[color:var(--accent)]/10 text-[color:var(--accent-deep)]"
                : "bg-[color:var(--forest)]/10 text-[color:var(--forest)]"
            }`}
          >
            {p.madeToOrder ? "Made to order" : "Ready to ship"}
          </span>
        </div>
        <h3 className="mt-2 font-display text-xl leading-tight">{p.title}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-base font-semibold">{p.priceLabel}</span>
          <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--accent-deep)] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 max-w-xl mx-auto">
      <h2 className="font-display text-3xl">The shop is between drops.</h2>
      <p className="mt-4 text-[color:var(--muted)]">
        I couldn&apos;t load the catalogue right now. Tell me what you&apos;re looking for and
        I&apos;ll come back with options — every piece is made to order anyway.
      </p>
      <Link href="/contact" className="btn btn-primary mt-8">
        Tell me what you&apos;re after →
      </Link>
    </div>
  );
}
