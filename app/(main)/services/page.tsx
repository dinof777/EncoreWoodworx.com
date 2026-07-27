import Link from "next/link";
import { Section, SectionHeader, Eyebrow } from "@/components/Section";

const services = [
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

export default function Services() {
  return (
    <>
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 30%, rgba(214,168,106,0.5), transparent 50%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 md:py-32 relative">
          <p className="eyebrow !text-[color:var(--accent-soft)]">Artisanal Woodcrafts</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-4xl leading-[1.02]">
            Bespoke wooden creations, made for the way you live.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--surface)]/80 leading-relaxed">
            There are very few things I won&apos;t take on. If you have an idea you want
            to bring to life, I&apos;d love to help. Custom tables, desks, wood or steel
            stair railings, epoxy river tables, live-edge furniture, lamps — give me a
            call to talk through what you&apos;re thinking.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact" className="btn btn-primary">Discover More</Link>
            <a
              href="https://photos.app.goo.gl/nanyeNbDvnaD7ujd7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light"
            >
              See Past Work
            </a>
          </div>
        </div>
      </section>

      <Section>
        <SectionHeader
          eyebrow="What I Build"
          title="Eight things I do most — and a hundred I don&rsquo;t list."
          intro="Every project is a conversation. Start with one of these or bring me something I've never tried."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-2xl p-7 hover:shadow-lg hover:border-[color:var(--accent)] transition-all"
            >
              <Eyebrow>Service</Eyebrow>
              <h3 className="font-display text-2xl mt-2">{s.title}</h3>
              <p
                className="mt-3 text-[color:var(--muted)] leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: s.body }}
              />
            </article>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-3xl bg-[color:var(--accent-deep)] text-[color:var(--surface)] p-12 md:p-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <Eyebrow>Get in Touch</Eyebrow>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
              Have an idea? Let&apos;s sketch it out.
            </h2>
            <p className="mt-4 max-w-xl text-[color:var(--surface)]/85">
              Send me a few details — wood, dimensions, where it&apos;ll live — and
              I&apos;ll come back with options and a quote.
            </p>
          </div>
          <div className="md:col-span-4 flex md:justify-end">
            <Link href="/contact" className="btn btn-light">Start a Project</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
