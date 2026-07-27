import Link from "next/link";
import { Section, Eyebrow } from "@/components/Section";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Encore Woodworx",
  description:
    "Have an idea for a custom piece? Tell me about it. I answer every message.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 60%, rgba(201,180,140,0.55), transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28 relative">
          <p className="eyebrow !text-[color:var(--accent-soft)]">Get in touch</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-3xl leading-[1.02]">
            Tell me what you have in mind.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--surface)]/80 leading-relaxed">
            Sketch, Pinterest board, or three sentences. I&rsquo;ll come back with wood options, a
            quote, and a timeline. I answer every message.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-7 lg:order-2">
            <div className="rounded-3xl bg-[color:var(--surface)] border border-[color:var(--border)] p-8 md:p-10 shadow-sm">
              <Eyebrow>Project inquiry</Eyebrow>
              <h2 className="font-display text-3xl mt-2">Send us a note</h2>
              <p className="mt-3 text-[color:var(--muted)] text-sm">
                I typically reply within one business day.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:order-1 space-y-10">
            <div>
              <Eyebrow>Workshop hours</Eyebrow>
              <ul className="mt-4 space-y-1.5 text-[color:var(--foreground)]">
                <li className="flex justify-between gap-6 max-w-xs">
                  <span className="text-[color:var(--muted)]">Monday – Friday</span>
                  <span className="font-medium">10am – 7pm</span>
                </li>
                <li className="flex justify-between gap-6 max-w-xs">
                  <span className="text-[color:var(--muted)]">Saturday</span>
                  <span className="font-medium">10am – 6pm</span>
                </li>
                <li className="flex justify-between gap-6 max-w-xs">
                  <span className="text-[color:var(--muted)]">Sunday</span>
                  <span className="font-medium">10am – 6pm</span>
                </li>
              </ul>
            </div>

            <div>
              <Eyebrow>Where I am</Eyebrow>
              <p className="mt-4 text-[color:var(--foreground)] leading-relaxed">
                Fort Lauderdale, Florida.
                <br />
                I deliver locally and ship anywhere in the US through Etsy.
              </p>
            </div>

            <div>
              <Eyebrow>Find me elsewhere</Eyebrow>
              <ul className="mt-4 space-y-2 text-[color:var(--foreground)]">
                <li>
                  <a
                    href="https://florabrofurnishings.etsy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[color:var(--accent)] underline underline-offset-4"
                  >
                    Etsy → florabrofurnishings ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/dinof777/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[color:var(--accent)] underline underline-offset-4"
                  >
                    Instagram → @dinof777 ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/dino.flora"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[color:var(--accent)] underline underline-offset-4"
                  >
                    Facebook → dino.flora ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://photos.app.goo.gl/nanyeNbDvnaD7ujd7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[color:var(--accent)] underline underline-offset-4"
                  >
                    Past work gallery ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-[color:var(--surface)] border border-[color:var(--border)] p-6">
              <Eyebrow>For purchases</Eyebrow>
              <p className="mt-2 text-sm text-[color:var(--muted)] leading-relaxed">
                Existing items in the shop are best ordered through Etsy — secure checkout, buyer
                protection, real reviews.
              </p>
              <Link href="/shop" className="btn btn-ghost mt-5 text-xs">
                Browse the shop
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
