import Link from "next/link";
import { Section, SectionHeader, Eyebrow } from "@/components/Section";
import { getListings } from "@/lib/etsy";
import Image from "next/image";

export const revalidate = 3600;

export const metadata = {
  title: "Live Blended — A Side Project · Encore Woodworx",
  description:
    "Why a woodworking shop sells step-parent t-shirts: the story behind Live Blended, a side project to give every Stad and Stom the recognition they've earned.",
};

export default async function LiveBlendedPage() {
  const listings = await getListings();
  const tees = listings.filter((l) => l.kind === "apparel").slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] relative overflow-hidden isolate">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, rgba(201,180,140,0.55), transparent 55%), radial-gradient(circle at 20% 80%, rgba(168,122,53,0.4), transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32">
          <p className="eyebrow !text-[color:var(--accent-soft)]">A side project · Live Blended</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-4xl leading-[1.02]">
            Why a woodshop is selling t-shirts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-[color:var(--surface)]/80 leading-relaxed">
            Short version: I&apos;m a stepdad. Eighteen years ago I made up a word — <em>Stad</em>{" "}
            — to give my role a name. It worked. Live Blended is what grew out of that.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="https://liveblended.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Visit Live Blended ↗
            </a>
            <Link href="/shop" className="btn btn-light">
              Back to the shop
            </Link>
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <Section>
        <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="md:col-span-4 md:sticky md:top-28 self-start">
            <Eyebrow>The story</Eyebrow>
            <h2 className="font-display text-4xl mt-3 leading-[1.05]">
              How <em>Stad</em> got its name.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-6 text-lg leading-[1.75] text-[color:var(--foreground)]/90 max-w-2xl">
            <p className="font-display text-2xl md:text-3xl leading-[1.4] text-[color:var(--foreground)]">
              I was a stepdad struggling with my place in my new step-relationship with my new
              stepson. He also struggled with who this strange guy was in his house.
            </p>
            <p>
              One day I was in a situation where I needed to discipline him and he called me by my
              first name. I felt powerless. It was that moment I knew I had to define the
              relationship for both of us.
            </p>
            <p>
              After rattling off all the formal names — sir, Mr. Flora, etc. — we landed on{" "}
              <strong className="text-[color:var(--accent-deep)]">&ldquo;Stad.&rdquo;</strong> A
              mashup of <em>step</em> and <em>dad</em> that still sounds and feels respectful.
            </p>
            <p>
              Now my stepson has a better understanding of who I am, I feel like I&rsquo;m a part of
              the family, and his biological dad knows I&rsquo;m not trying to take his place. It
              turned out to be killing three birds with one stone — and it continues to work for us
              today, eighteen years later.
            </p>
            <p className="text-[color:var(--muted)] italic">
              — Dino Flora, Encore Woodworx &amp; Live Blended
            </p>
          </div>
        </div>
      </Section>

      {/* THE NUMBERS */}
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <Eyebrow>
              <span className="!text-[color:var(--accent-soft)]">Step-Parent Nation</span>
            </Eyebrow>
            <p className="font-display text-6xl md:text-7xl mt-3 leading-none text-[color:var(--accent-soft)]">
              95M
            </p>
            <p className="mt-4 text-xl text-[color:var(--surface)]/85 leading-relaxed">
              adults in the U.S. are in step-relationships. A blended home contains one adult who
              isn&apos;t the biological parent.
            </p>
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-px bg-[color:var(--surface)]/10 rounded-2xl overflow-hidden">
            <div className="bg-[color:var(--foreground)] p-7">
              <p className="font-display text-3xl text-[color:var(--accent-soft)]">Stad</p>
              <p className="mt-2 text-sm text-[color:var(--surface)]/80 leading-relaxed">
                A mashup of <em>step</em> + <em>dad</em>. Respectful, distinct, recognizes the role
                without erasing the biological dad.
              </p>
            </div>
            <div className="bg-[color:var(--foreground)] p-7">
              <p className="font-display text-3xl text-[color:var(--accent-soft)]">Stom</p>
              <p className="mt-2 text-sm text-[color:var(--surface)]/80 leading-relaxed">
                Same idea — <em>step</em> + <em>mom</em>. A name for the relationship that
                doesn&apos;t demand replacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <Section>
        <SectionHeader
          eyebrow="Why a name matters"
          title="A small word, a big shift."
        />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[
            {
              t: "Recognition",
              b: "A specific term gives clarity to a role that&apos;s real but unnamed. It acknowledges the daily contributions a stepdad or stepmom actually makes.",
            },
            {
              t: "Less stigma",
              b: "Naming the role helps reduce the negative stereotypes that hover around &ldquo;step-anything.&rdquo; It promotes a more positive, inclusive family dynamic.",
            },
            {
              t: "Easier conversations",
              b: "When everyone — bio dad, stepdad, kid, grandparents — has the same vocabulary, the conversations get clearer and the relationships get stronger.",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-7"
            >
              <h3 className="font-display text-2xl">{b.t}</h3>
              <p
                className="mt-3 text-[color:var(--muted)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: b.b }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* THE TEES — connection back to shop */}
      <section className="bg-[color:var(--accent-deep)] text-[color:var(--surface)] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-14">
            <div className="md:col-span-7">
              <Eyebrow>
                <span className="!text-[color:var(--accent-soft)]">Back to the shop</span>
              </Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
                And that&rsquo;s why there are tees in my wood shop.
              </h2>
            </div>
            <p className="md:col-span-5 text-[color:var(--surface)]/85 leading-relaxed">
              The Stad-isfaction, Stadmuffin, and Stad-ly designs all started here. Wear one if it
              fits your story — they&rsquo;re Father&rsquo;s Day gifts that hit a little harder than
              a tie.
            </p>
          </div>
          {tees.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {tees.map((t) => (
                <Link
                  key={t.id}
                  href={`/shop/${t.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-[color:var(--foreground)]/40 hover:bg-[color:var(--foreground)]/60 transition-colors"
                >
                  <div className="relative aspect-square">
                    {t.imageUrl && (
                      <Image
                        src={t.imageUrl}
                        alt={t.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs text-[color:var(--surface)]/85 line-clamp-2">{t.title}</p>
                    <p className="mt-1 text-sm font-semibold">{t.priceLabel}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MISSION + CTA */}
      <Section>
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <Eyebrow>The mission</Eyebrow>
            <h2 className="font-display text-3xl md:text-4xl mt-3 leading-[1.1]">
              Give every Stad and Stom the tools — and recognition — they&rsquo;ve earned.
            </h2>
          </div>
          <div className="md:col-span-7 space-y-6 text-lg leading-relaxed text-[color:var(--foreground)]/90">
            <p>
              Live Blended is the home for that work. It&rsquo;s where step parents can talk about
              the successes and the failures, share what works, and figure this out together.
            </p>
            <p>
              If you&rsquo;re a Stad or a Stom, or you love one — come hang out. The site, the
              merch, and the conversation are all over there.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <a
                href="https://liveblended.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit Live Blended ↗
              </a>
              <a
                href="https://www.instagram.com/step_parent_nation/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                @step_parent_nation
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
