import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/Section";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found — Encore Woodworx" };
  return {
    title: `${post.title} — Shop Tips · Encore Woodworx`,
    description: post.excerpt ?? post.body[0]?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.body[0]?.slice(0, 160),
      images: post.cover ? [{ url: post.cover }] : undefined,
      type: "article",
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getAllPosts();
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article>
        {/* HEADER */}
        <Section className="!pt-12 md:!pt-16 !pb-0">
          <nav className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted)] mb-10">
            <Link href="/" className="hover:text-[color:var(--accent)]">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <Link href="/shop-tips" className="hover:text-[color:var(--accent)]">Shop Tips</Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-[color:var(--foreground)] truncate">{post.title}</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.22em]">
              <span className="px-3 py-1 rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent-deep)] font-semibold">
                {post.category}
              </span>
              <span className="text-[color:var(--muted)]">{formatDate(post.date)}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mt-6 leading-[1.02]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-6 text-xl text-[color:var(--muted)] leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </Section>

        {post.cover && (
          <Section className="!py-12 md:!py-16">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </Section>
        )}

        {/* BODY */}
        <Section className="!pt-0">
          <div className="max-w-2xl mx-auto">
            {post.body.map((para, i) => (
              <p
                key={i}
                className={`text-[color:var(--foreground)]/90 leading-[1.75] mb-6 ${
                  i === 0 ? "text-xl md:text-2xl font-display" : "text-lg"
                }`}
              >
                {para}
              </p>
            ))}

            {post.products && post.products.length > 0 && (
              <aside className="mt-12 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
                <Eyebrow>Mentioned in this post</Eyebrow>
                <ul className="mt-4 divide-y divide-[color:var(--border)]">
                  {post.products.map((p, i) => (
                    <li key={i} className="py-3 flex items-baseline justify-between gap-4">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        {p.subtitle && (
                          <p className="text-sm text-[color:var(--muted)]">{p.subtitle}</p>
                        )}
                      </div>
                      {p.price && (
                        <span className="text-sm font-semibold text-[color:var(--accent-deep)] shrink-0">
                          {p.price}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <hr className="my-14 border-[color:var(--border)]" />

            <div className="flex items-center justify-between flex-wrap gap-4">
              <Link
                href="/shop-tips"
                className="text-sm font-semibold text-[color:var(--accent-deep)] hover:underline underline-offset-4"
              >
                ← All shop tips
              </Link>
              <Link href="/contact" className="btn btn-ghost text-xs">
                Ask a question
              </Link>
            </div>
          </div>
        </Section>
      </article>

      {more.length > 0 && (
        <Section className="!pt-0">
          <div className="border-t border-[color:var(--border)] pt-16">
            <h2 className="font-display text-3xl md:text-4xl mb-10">Keep reading</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {more.map((p) => (
                <Link
                  key={p.slug}
                  href={`/shop-tips/${p.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-[color:var(--surface)] border border-[color:var(--border)] hover:border-[color:var(--accent)] transition-all"
                >
                  <div className="relative aspect-[4/3]" style={{ background: "var(--surface-media)" }}>
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
                    <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--accent-deep)] font-semibold">
                      {p.category}
                    </p>
                    <h3 className="font-display text-lg mt-2 leading-tight line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
