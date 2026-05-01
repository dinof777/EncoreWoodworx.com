"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const variants = [
  { href: "/", label: "V1 · Warm Walnut", note: "current" },
  { href: "/preview/editorial", label: "V2 · Editorial Gallery", note: "lighter" },
  { href: "/preview/scandi", label: "V3 · Soft Scandi", note: "brighter" },
];

export function PreviewSwitcher() {
  const pathname = usePathname();
  if (!pathname.startsWith("/preview")) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto">
      <div className="rounded-full border border-black/10 bg-white/85 backdrop-blur-md shadow-xl px-2 py-2 flex items-center gap-1 text-xs">
        {variants.map((v) => {
          const active =
            v.href === "/" ? pathname === "/" : pathname.startsWith(v.href);
          return (
            <Link
              key={v.href}
              href={v.href}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                active
                  ? "bg-black text-white"
                  : "text-black/70 hover:bg-black/5"
              }`}
            >
              <span className="font-semibold">{v.label}</span>
              <span className="ml-2 opacity-60">{v.note}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
