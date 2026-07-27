"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  images: { src: string; alt: string }[];
  intervalMs?: number;
};

export function HeroSlideshow({ images, intervalMs = 5000 }: Props) {
  const [i, setI] = useState(0);
  const safe = images.filter((x) => !!x.src);

  useEffect(() => {
    if (safe.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % safe.length), intervalMs);
    return () => clearInterval(id);
  }, [safe.length, intervalMs]);

  if (safe.length === 0) return null;
  const current = safe[i];

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Slideshow layer */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current.src + i}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Wood-tinted darken overlay so the type stays readable on any photo */}
      <div className="absolute inset-0 bg-[color:var(--foreground)]/62" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(201,180,140,0.35), transparent 55%), radial-gradient(circle at 75% 75%, rgba(168,122,53,0.35), transparent 55%), linear-gradient(140deg, rgba(26,24,21,0.55), rgba(26,24,21,0.0) 60%, rgba(26,24,21,0.7))",
        }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(105deg, rgba(250,248,243,0.07) 0 2px, transparent 2px 9px)",
        }}
      />

      {/* Bottom progress dots — only show if multiple images */}
      {safe.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {safe.map((_, j) => (
            <button
              key={j}
              onClick={() => setI(j)}
              aria-label={`Show image ${j + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                j === i ? "w-8 bg-[color:var(--surface)]" : "w-2 bg-[color:var(--surface)]/40 hover:bg-[color:var(--surface)]/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
