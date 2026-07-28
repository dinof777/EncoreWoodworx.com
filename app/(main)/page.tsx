import Link from "next/link";
import { Section, SectionHeader, Eyebrow } from "@/components/Section";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { getListings } from "@/lib/etsy";
import { shufflePhotos, rotationBucket } from "@/lib/photos";

export const revalidate = 3600;

const crafts = [
  {
    title: "Epoxy River Tables",
    description:
      "Live-edge slabs married to deep-pour epoxy in custom colors. Centerpiece dining tables, conference tables, bar tops.",
  },
  {
    title: "Live-Edge Furniture",
    description:
      "Desks, benches, consoles and headboards milled from locally sourced slabs — every grain pattern unrepeatable.",
  },
  {
    title: "Sliding Barn Doors",
    description:
      "Hand-built doors with blacksmithed hardware. Reclaimed, painted, or stained to match your space.",
  },
  {
    title: "Custom Countertops",
    description:
      "Butcher block, live-edge, end-grain, or epoxy-sealed kitchen and bar surfaces, finished food-safe.",
  },
  {
    title: "Stair & Steel Railings",
    description:
      "Wood-and-steel railings welded and finished in-house — modern industrial or rustic farmhouse.",
  },
  {
    title: "Organizational Pieces",
    description:
      "Built-ins, shelving, mudroom benches, and storage that earns its place — designed around how you actually live.",
  },
];

const story = [
  {
    title: "Crafted Pieces",
    body:
      "Encore Woodworx is a one-person shop with a wide range of skillsets — from blacksmithing to fine carpentry. If you can dream it up, I will create it for you. Epoxy tables, sliding barn doors, live-edge desks, countertops, organizational items… check out some of my past work or reach out for a custom job.",
  },
  {
    title: "Beyond a Store",
    body:
      "I'm a maker first. I'm always on hand to talk through wood species, joinery, finishing schedules, and how to make a piece live in your space. I also offer custom design services specializing in farmhouse and coastal décor.",
  },
  {
    title: "Meet the Maker",
    body:
      "I'm a maker and an artist, just like you. Send me a picture of your finished project and feedback on how the materials worked for you — your work could be in my next gallery show.",
  },
];

export default async function Home() {
  const listings = await getListings();
  // Own photography leads when there is any; the Etsy catalogue is the fallback so the
  // hero is never empty before photos have been added.
  const ownPhotos = shufflePhotos(`home-hero-${rotationBucket()}`);
  const heroImages =
    ownPhotos.length > 0
      ? ownPhotos
      : listings
          .filter((l) => l.kind === "woodworking" && !!l.imageUrl)
          .slice(0, 8)
          .map((l) => ({ src: l.imageUrl as string, alt: l.title }));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden isolate">
        <HeroSlideshow images={heroImages} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-28 md:py-40 text-[color:var(--surface)]">
          <p className="eyebrow !text-[color:var(--accent-soft)]">Artisan Wooden Creations</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mt-4 max-w-4xl leading-[0.98]">
            Unique handcrafted wooden furnishings for your home or business.
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-[color:var(--surface)]/80 leading-relaxed">
            One workshop. One pair of hands. Every piece milled, joined, and finished
            by hand — built to be passed down.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn btn-primary">Shop Now</Link>
            <Link href="/contact" className="btn btn-light">Commission a Piece</Link>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <Section>
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <SectionHeader
              eyebrow="Our Story"
              title="One shop, one pair of hands."
              intro="What started as weekend projects became a shop where craft and a little stubbornness about doing things right live under one roof."
            />
            <blockquote className="mt-8 pl-5 border-l-2 border-[color:var(--accent)] font-display italic text-2xl leading-snug">
              When your roots are deep, there is no reason to fear the wind.
            </blockquote>
            <Link href="/services" className="btn btn-ghost mt-8">Our Services</Link>
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-1 gap-6">
            {story.map((s) => (
              <div
                key={s.title}
                className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-2xl p-7 shadow-sm"
              >
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-[color:var(--muted)] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CRAFTED PIECES */}
      <section className="py-20 md:py-28 bg-[color:var(--foreground)] text-[color:var(--surface)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow !text-[color:var(--accent-soft)]">What I Make</p>
              <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
                If you can dream it, I&apos;ll build it.
              </h2>
            </div>
            <p className="max-w-md text-[color:var(--surface)]/75">
              A short list of the pieces I make most often. Don&apos;t see yours?
              That just means I haven&apos;t built it yet.
            </p>
          </div>
          <div className="mt-14 grid gap-px bg-[color:var(--surface)]/15 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden">
            {crafts.map((c) => (
              <div
                key={c.title}
                className="bg-[color:var(--foreground)] p-8 hover:bg-[color:var(--accent)]/25 transition-colors"
              >
                <h3 className="font-display text-2xl text-[color:var(--accent-soft)]">
                  {c.title}
                </h3>
                <p className="mt-3 text-[color:var(--surface)]/80 leading-relaxed">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="https://photos.app.goo.gl/nanyeNbDvnaD7ujd7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light"
            >
              See the Gallery
            </a>
            <Link href="/contact" className="btn btn-primary">
              Start a Custom Job
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <Section>
        <div className="grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4">
            <SectionHeader
              eyebrow="How It Works"
              title="Sketch to delivery, in four steps."
            />
          </div>
          <ol className="md:col-span-8 grid sm:grid-cols-2 gap-6">
            {[
              {
                n: "01",
                t: "Conversation",
                d: "Tell us what you have in mind — a Pinterest board, a rough sketch, or just dimensions. We talk through wood, finish, and budget together.",
              },
              {
                n: "02",
                t: "Design & Quote",
                d: "I draft the piece, pick the slab or stock, and send a fixed quote with timeline. No surprises later.",
              },
              {
                n: "03",
                t: "Build",
                d: "Milling, joinery, finishing — done by hand in my shop. I share progress photos along the way.",
              },
              {
                n: "04",
                t: "Delivery & Install",
                d: "I deliver locally and can install built-ins, doors, and railings. The piece is yours, finished and ready.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="border border-[color:var(--border)] rounded-2xl p-7 bg-[color:var(--surface)]"
              >
                <span className="font-display text-3xl text-[color:var(--accent)]">{s.n}</span>
                <h3 className="mt-2 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-[color:var(--muted)] leading-relaxed text-sm">
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* NEWSLETTER / ARTISAN SELECTION */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="rounded-3xl bg-[color:var(--accent-deep)] text-[color:var(--surface)] p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-20 -z-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, rgba(250,248,243,0.18) 0 1px, transparent 1px 16px)",
              }}
            />
            <div className="relative">
              <Eyebrow>Artisan Selection</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
                Join the makers list.
              </h2>
              <p className="mt-4 text-[color:var(--surface)]/85 max-w-md">
                New pieces, gallery openings, and shop tips — sent occasionally, never
                spammy.
              </p>
            </div>
            <div className="relative">
              <NewsletterForm />
            </div>
          </div>
        </div>
        <div className="h-20" />
      </section>

      {/* CTA STRIP */}
      <Section className="!pt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/services"
            className="group rounded-2xl p-10 border border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--surface)] transition-colors"
          >
            <Eyebrow>Services</Eyebrow>
            <h3 className="font-display text-3xl mt-3">Bespoke wood &amp; steel work →</h3>
            <p className="mt-3 text-[color:var(--muted)] group-hover:text-[color:var(--surface)]/75">
              Tables, desks, doors, railings, lamps. If it can be made of wood (or wood
              and steel), I&apos;ll make it.
            </p>
          </Link>
          <Link
            href="/shop-tips"
            className="group rounded-2xl p-10 border border-[color:var(--border)] bg-[color:var(--surface)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--surface)] transition-colors"
          >
            <Eyebrow>Shop Tips</Eyebrow>
            <h3 className="font-display text-3xl mt-3">Notes from the workshop →</h3>
            <p className="mt-3 text-[color:var(--muted)] group-hover:text-[color:var(--surface)]/75">
              Wood selection, finishing, care, and the small things that make a piece
              last.
            </p>
          </Link>
        </div>
      </Section>
    </>
  );
}
