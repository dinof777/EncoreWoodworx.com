import { Section, Eyebrow } from "@/components/Section";
import { BasketView } from "@/components/BasketView";
import { PageHeroPhoto } from "@/components/PageHeroPhoto";

export const metadata = {
  title: "Your Project — Encore Woodworx",
  description:
    "Review the custom pieces you're considering. Send the whole project to the shop as one inquiry.",
};

export default function BasketPage() {
  return (
    <>
      <section className="bg-[color:var(--foreground)] text-[color:var(--surface)] relative overflow-hidden isolate">
        <PageHeroPhoto seed="basket" />
        <div
          className="absolute inset-0 -z-10 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 40%, rgba(201,180,140,0.55), transparent 55%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
          <p className="eyebrow !text-[color:var(--accent-soft)]">Your project basket</p>
          <h1 className="font-display text-5xl md:text-7xl mt-4 max-w-4xl leading-[1.02]">
            Build your project, then send it.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--surface)]/80 leading-relaxed">
            Custom pieces are quoted together — wood, dimensions, and finish all get cleaner
            answers when I see the whole project at once.
          </p>
        </div>
      </section>

      <Section>
        <BasketView />
      </Section>

      <Section className="!pt-0">
        <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-10 md:p-14">
          <Eyebrow>How this works</Eyebrow>
          <div className="mt-6 grid md:grid-cols-3 gap-8">
            {[
              {
                n: "01",
                t: "You add pieces",
                d: "Browse the shop and add any made-to-order piece. No commitment, no checkout yet.",
              },
              {
                n: "02",
                t: "We quote together",
                d: "Send your project. I come back with a tailored quote — wood, dimensions, finish, lead time.",
              },
              {
                n: "03",
                t: "Order through Etsy",
                d: "Once the details are settled, I send a custom Etsy invoice. Secure checkout, buyer protection, tracked shipping.",
              },
            ].map((s) => (
              <div key={s.n}>
                <p className="font-display text-3xl text-[color:var(--accent)]">{s.n}.</p>
                <h3 className="mt-2 text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-[color:var(--muted)] leading-relaxed text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
