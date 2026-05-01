"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { stubListings } from "@/lib/etsy-stub";

const ease = [0.22, 1, 0.36, 1] as const;

const sage = "#7a8b6e";
const sageDeep = "#5a6c4f";
const ivory = "#fbf9f4";
const stone = "#2a2622";
const card = "#ffffff";

export default function ScandiPreview() {
  return (
    <div
      className="min-h-screen flex-1"
      style={{
        background: ivory,
        color: stone,
        fontFamily: "var(--font-inter), system-ui, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ background: "rgba(251, 249, 244, 0.85)", borderBottom: "1px solid #ece6d8" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/preview/scandi" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: sage }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2 L4 8 L4 20 L20 20 L20 8 Z" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight text-lg">Encore Woodworx</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#shop" className="hover:opacity-60 transition-opacity">Shop</a>
            <a href="#services" className="hover:opacity-60 transition-opacity">Services</a>
            <a href="#story" className="hover:opacity-60 transition-opacity">Our story</a>
            <a href="https://photos.app.goo.gl/nanyeNbDvnaD7ujd7" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">Gallery</a>
          </nav>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5"
            style={{ background: stone, color: ivory }}
          >
            Start a project
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
          style={{ background: `${sage}20` }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute top-1/3 -left-24 w-[300px] h-[300px] rounded-full"
          style={{ background: "#e9c39620" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 md:pt-24 pb-16 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{ background: `${sage}15`, color: sageDeep, border: `1px solid ${sage}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sage }} />
            Made in Florida · Shipped from the workshop
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight max-w-4xl"
            style={{ fontWeight: 600, letterSpacing: "-0.03em" }}
          >
            Quiet, well-made wood pieces for the way you actually live.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed opacity-75"
          >
            Five brothers. One workshop. Custom epoxy tables, live-edge desks, sliding barn doors,
            and built-ins — handcrafted, gently finished, built to last.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <a
              href="#shop"
              className="px-6 py-3.5 rounded-full text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: sage, color: "white" }}
            >
              Browse the shop →
            </a>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-full text-sm font-semibold border"
              style={{ borderColor: `${stone}30`, color: stone }}
            >
              Commission a piece
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { v: "5", l: "Brothers" },
              { v: "100+", l: "Custom pieces" },
              { v: "1–2 wks", l: "Typical lead time" },
              { v: "★ 4.9", l: "Etsy rating" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl p-5"
                style={{ background: card, border: "1px solid #ece6d8" }}
              >
                <p
                  className="text-3xl md:text-4xl font-semibold tracking-tight"
                  style={{ color: sageDeep }}
                >
                  {s.v}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-60">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SHOP — bento grid */}
      <section id="shop" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] mb-2" style={{ color: sageDeep }}>
              Live from Etsy
            </p>
            <h2 className="text-4xl md:text-5xl tracking-tight" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
              In the shop right now
            </h2>
          </div>
          <a
            href="https://florabrofurnishings.etsy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4 opacity-80"
          >
            See everything on Etsy →
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-5">
          {stubListings.slice(0, 6).map((p, i) => {
            const span =
              i === 0
                ? "col-span-2 md:col-span-3 md:row-span-2"
                : i === 3
                ? "col-span-2 md:col-span-3"
                : "col-span-1 md:col-span-2";
            return (
              <motion.a
                key={p.id}
                href={p.etsyUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className={`group block rounded-3xl overflow-hidden ${span}`}
                style={{ background: card, border: "1px solid #ece6d8" }}
              >
                <div
                  className={`relative ${i === 0 ? "aspect-[4/5]" : "aspect-square"}`}
                  style={{ background: "#f3eee2" }}
                >
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <p className="font-medium text-sm md:text-base">{p.title}</p>
                  <p
                    className="text-sm font-semibold shrink-0 px-3 py-1 rounded-full"
                    style={{ background: `${sage}15`, color: sageDeep }}
                  >
                    ${p.priceUsd}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* SERVICES — soft cards */}
      <section
        id="services"
        className="py-20 md:py-28"
        style={{ background: "#f3eee2" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-12 gap-10 items-end mb-14">
            <div className="md:col-span-7">
              <p className="text-xs uppercase tracking-[0.22em] mb-2" style={{ color: sageDeep }}>
                Bespoke services
              </p>
              <h2 className="text-4xl md:text-5xl tracking-tight" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
                If you can dream it, we&rsquo;ll build it.
              </h2>
            </div>
            <p className="md:col-span-5 text-base md:text-lg opacity-75 leading-relaxed">
              Custom tables, desks, doors, railings, lamps. Eight things we do most — and a hundred
              more we don&rsquo;t list.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Epoxy river tables", d: "Live-edge slabs + custom-tinted epoxy." },
              { t: "Live-edge desks", d: "Hand-selected slabs, food-safe finish." },
              { t: "Sliding barn doors", d: "Blacksmithed hardware in-house." },
              { t: "Built-in storage", d: "Mudrooms, closets, bookshelves." },
            ].map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                className="rounded-3xl p-6"
                style={{ background: card, border: "1px solid #ece6d8" }}
              >
                <div
                  className="w-9 h-9 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: `${sage}20`, color: sageDeep }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.t}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <p className="text-xs uppercase tracking-[0.22em] mb-2" style={{ color: sageDeep }}>
              Our story
            </p>
            <h2
              className="text-4xl md:text-5xl tracking-tight mb-6"
              style={{ fontWeight: 600, letterSpacing: "-0.02em" }}
            >
              A workshop run by five brothers.
            </h2>
            <p className="text-lg opacity-75 leading-relaxed max-w-xl">
              What started as helping each other with weekend projects became a shop where craft,
              family, and a stubborn streak about doing things right all live under one roof.
            </p>
            <p className="mt-4 text-lg opacity-75 leading-relaxed max-w-xl">
              We mill our own slabs, forge our own hardware, and finish every piece by hand. The
              brothers are always available to talk through wood, joinery, and how a piece will live
              in your space.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
            className="md:col-span-6 relative aspect-[4/5] rounded-3xl overflow-hidden"
            style={{ background: "#e8dec9" }}
          >
            <Image
              src={stubListings[1].imageUrl}
              alt="In the workshop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: stone, color: ivory }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-6">
              <p className="text-xs uppercase tracking-[0.22em] opacity-60 mb-3">Stay in touch</p>
              <h3 className="text-3xl md:text-4xl tracking-tight" style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
                New pieces, gallery openings, and shop tips — occasionally, never spammy.
              </h3>
            </div>
            <form className="md:col-span-6 flex gap-2 md:justify-end">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 md:flex-initial md:w-72 px-5 py-3.5 rounded-full text-sm"
                style={{ background: "rgba(255,255,255,0.08)", color: ivory, border: "1px solid rgba(255,255,255,0.15)" }}
              />
              <button
                type="button"
                className="px-6 py-3.5 rounded-full text-sm font-semibold"
                style={{ background: sage, color: "white" }}
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="mt-12 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs opacity-60" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p>© 2026 Encore Woodworx</p>
            <p>Mon–Fri 10–7 · Sat–Sun 10–6</p>
            <p>
              <a href="https://www.instagram.com/dinof777/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Instagram</a>
              <span className="mx-3 opacity-50">·</span>
              <a href="https://www.facebook.com/dino.flora" target="_blank" rel="noopener noreferrer" className="hover:opacity-100">Facebook</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
