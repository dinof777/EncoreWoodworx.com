"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { stubListings } from "@/lib/etsy-stub";

const ease = [0.22, 1, 0.36, 1] as const;

export default function EditorialPreview() {
  return (
    <div
      className="min-h-screen flex-1"
      style={{
        background: "#f6f1e8",
        color: "#1a1410",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <header className="border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full" style={{ background: "#cc6f4a" }} />
            <div className="leading-tight">
              <p
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 600,
                  fontSize: "1.4rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Encore Woodworx
              </p>
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">
                Vol. 01 · Issue No. 1 · Spring 2026
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.22em] opacity-80">
            <a href="#story">Story</a>
            <a href="#shop">Shop</a>
            <a href="#services">Services</a>
            <a href="#contact">Visit</a>
          </nav>
          <a
            href="https://florabrofurnishings.etsy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.22em] underline underline-offset-4"
          >
            Etsy ↗
          </a>
        </div>
      </header>

      {/* HERO — magazine cover */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 pt-16 md:pt-24 pb-20">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-7">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="text-xs uppercase tracking-[0.3em] mb-8"
                style={{ color: "#cc6f4a" }}
              >
                The Workshop · Feature
              </motion.p>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease, delay: 0.1 }}
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 400,
                  letterSpacing: "-0.035em",
                  lineHeight: 0.95,
                }}
                className="text-[14vw] md:text-[10vw] lg:text-[9rem]"
              >
                Slow
                <br />
                <span style={{ fontStyle: "italic", color: "#cc6f4a" }}>made</span>
                <br />
                furniture.
              </motion.h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.4 }}
              className="md:col-span-5"
            >
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden">
                <Image
                  src={stubListings[0].imageUrl}
                  alt="Custom epoxy river desk"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-xs uppercase tracking-[0.22em] opacity-60">
                  Featured · Epoxy river desk
                </p>
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-fraunces), serif", fontStyle: "italic" }}
                >
                  Plate I.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Lede */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="mt-16 md:mt-24 grid md:grid-cols-12 gap-10"
          >
            <div className="md:col-span-3">
              <p className="text-xs uppercase tracking-[0.3em] opacity-60 leading-relaxed">
                Florida · Five Brothers · Est. with stubborn intent
              </p>
            </div>
            <p
              className="md:col-span-7 md:col-start-5"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1.6rem",
                lineHeight: 1.4,
                fontWeight: 300,
              }}
            >
              <span style={{ color: "#cc6f4a", fontWeight: 600 }}>Encore Woodworx</span> is a
              creative collaboration of five brothers — blacksmiths and carpenters — making
              one-of-a-kind pieces that are meant to outlast us. Epoxy river tables. Live-edge
              desks. Sliding barn doors. If you can dream it up, we&rsquo;ll build it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRESS RULE */}
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="border-t border-black/15" />
      </div>

      {/* FEATURES — three pulled quotes */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            {
              num: "01",
              title: "Hand-milled",
              body: "Slabs sourced locally, milled and dried in-shop. Every grain pattern is unrepeatable.",
            },
            {
              num: "02",
              title: "Joinery first",
              body: "Mortise-and-tenon, dovetail, finger joint. Glue and screws are a last resort.",
            },
            {
              num: "03",
              title: "Finished food-safe",
              body: "Hard-wax oil and shop-mixed butcher block conditioners. No plastic finishes.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              className="border-t border-black/15 pt-6"
            >
              <p
                className="text-5xl mb-6"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 300,
                  color: "#cc6f4a",
                }}
              >
                {f.num}.
              </p>
              <h3
                className="text-2xl mb-3"
                style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 500 }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed opacity-75">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATALOGUE — mixed grid */}
      <section id="shop" className="bg-[#efe7d6]/60 border-y border-black/10">
        <div className="max-w-[1400px] mx-auto px-8 py-24">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "#cc6f4a" }}>
                The Catalogue · Spring 2026
              </p>
              <h2
                className="text-5xl md:text-6xl"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                }}
              >
                In the workshop, <em>now</em>.
              </h2>
            </div>
            <a
              href="https://florabrofurnishings.etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.22em] underline underline-offset-4"
            >
              Browse all on Etsy ↗
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8">
            {stubListings.slice(0, 6).map((p, i) => (
              <motion.a
                key={p.id}
                href={p.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`group block ${
                  i === 0
                    ? "col-span-2 md:col-span-7 md:row-span-2"
                    : i === 1
                    ? "col-span-2 md:col-span-5"
                    : "col-span-1 md:col-span-3"
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-sm ${
                    i === 0 ? "aspect-[4/5]" : "aspect-square"
                  }`}
                  style={{ background: "#e8dec9" }}
                >
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <p
                    className="text-base"
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontWeight: 500,
                    }}
                  >
                    {p.title}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-70 shrink-0">
                    ${p.priceUsd}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — letter from the brothers */}
      <section className="max-w-[1400px] mx-auto px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.3em] opacity-60">
              A note from the brothers
            </p>
          </div>
          <div className="md:col-span-7 md:col-start-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease }}
              className="text-4xl md:text-6xl mb-10"
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 400,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              Thinking of a piece? <em style={{ color: "#cc6f4a" }}>Tell us about it.</em>
            </motion.h2>
            <p className="text-lg leading-relaxed opacity-80 max-w-xl">
              Send a sketch, a Pinterest board, or three sentences. We&rsquo;ll come back with
              wood options, a quote, and a timeline. No pressure, no upsells.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="px-6 py-3 text-xs uppercase tracking-[0.22em]"
                style={{ background: "#1a1410", color: "#f6f1e8" }}
              >
                Start a Project →
              </Link>
              <a
                href="https://florabrofurnishings.etsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs uppercase tracking-[0.22em] border border-black/30"
              >
                Shop on Etsy
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOT */}
      <footer className="border-t border-black/15 mt-12">
        <div className="max-w-[1400px] mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] opacity-70">
          <p>© 2026 Encore Woodworx · Florida</p>
          <p>Mon–Fri 10–7 · Sat–Sun 10–6</p>
          <p>
            <a href="https://www.instagram.com/dinof777/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <span className="mx-3 opacity-40">·</span>
            <a href="https://www.facebook.com/dino.flora" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
