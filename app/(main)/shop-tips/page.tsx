import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeader, Eyebrow } from "@/components/Section";
import { getAllPosts, formatDate } from "@/lib/blog";
import { PageHeroPhoto } from "@/components/PageHeroPhoto";

export const metadata = {
  title: "Shop Tips — Encore Woodworx",
  description:
    "Notes from the workshop on tools, finishes, and how to care for handcrafted wood furniture.",
};

export default async function ShopTipsPage() {
  const posts = await getAllPosts();
  const [feature, ...rest] = posts;
  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <>
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] relative overflow-hidden isolate">
        <PageHeroPhoto seed="shop-tips" />
        <div
          className="absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 40%, rgba(201,180,140,0.55), transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32">
          <p className="eyebrow !text-[color:var(--accent-soft)]">Notes from the workshop</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-4xl leading-[1.02]">
            Shop tips, tool reviews, and lessons from the bench.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--surface)]/80 leading-relaxed">
            Practical advice on tools, finishes, and the small habits that make a piece last.
            Written between projects, never on a deadline.
          </p>
          {categories.length > 1 && (
            <ul className="mt-10 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li
                  key={c}
                  className="px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] border border-[color:var(--surface)]/30 text-[color:var(--surface)]/85"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {posts.length === 0 ? (
        <Section>
          <p className="text-center text-[color:var(--muted)] py-20">
            No posts yet. Check back soon.
          </p>
        </Section>
      ) : (
        <>
          {/* FEATURED POST */}
          <Section>
            <Link
              href={`/shop-tips/${feature.slug}`}
              className="group block rounded-3xl overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface)] hover:shadow-2xl hover:border-[color:var(--accent)] transition-all"
            >
              <div className="grid md:grid-cols-12 gap-0">
                <div className="md:col-span-7 relative aspect-[16/10] md:aspect-auto md:min-h-[420px]">
                  {feature.cover && (
                    <Image
                      src={feature.cover}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      priority
                    />
                  )}
                </div>
                <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em]">
                    <span className="px-3 py-1 rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent-deep)] font-semibold">
                      {feature.category}
                    </span>
                    <span className="text-[color:var(--muted)]">{formatDate(feature.date)}</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-5xl mt-5 leading-[1.05]">
                    {feature.title}
                  </h2>
                  {feature.excerpt && (
                    <p className="mt-5 text-[color:var(--muted)] leading-relaxed text-lg">
                      {feature.excerpt}
                    </p>
                  )}
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent-deep)] group-hover:translate-x-1 transition-transform">
                    Read the post →
                  </span>
                </div>
              </div>
            </Link>
          </Section>

          {/* OTHER POSTS */}
          {rest.length > 0 && (
            <Section className="!pt-0">
              <SectionHeader eyebrow="More from the workshop" title="Recent posts" />
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/shop-tips/${p.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--accent)] hover:shadow-lg transition-all"
                  >
                    <div
                      className="relative aspect-[4/3]"
                      style={{ background: "var(--surface-media)" }}
                    >
                      {p.cover && (
                        <Image
                          src={p.cover}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em]">
                        <span className="text-[color:var(--accent-deep)] font-semibold">{p.category}</span>
                        <span className="text-[color:var(--muted)]">{formatDate(p.date)}</span>
                      </div>
                      <h3 className="font-display text-xl mt-2 leading-tight">{p.title}</h3>
                      {p.excerpt && (
                        <p className="mt-2 text-sm text-[color:var(--muted)] line-clamp-3">
                          {p.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      <Section className="!pt-0">
        <div className="rounded-3xl bg-[color:var(--accent-deep)] text-[color:var(--surface)] p-12 md:p-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <Eyebrow>Have a question I didn&rsquo;t answer?</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
              Ask me. I answer every email.
            </h2>
            <p className="mt-4 max-w-xl text-[color:var(--surface)]/85">
              Refinishing tips, repair questions, what oil to buy at the hardware store — drop me a
              line.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link href="/contact" className="btn btn-light">Send a question</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
