"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type NavLink = { href: string; label: string; external?: boolean };

/**
 * The mobile nav dropdown.
 *
 * Split out of <Nav> as a client component for one reason: it is a <details>
 * element, and App Router navigation is client-side, so nothing ever resets its
 * `open` attribute. Tapping a link used to route the page and leave the menu
 * hanging open over the new content. This closes it on tap, on route change,
 * on Escape, and on an outside tap.
 */
export function MobileMenu({ links }: { links: NavLink[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  const close = () => ref.current?.removeAttribute("open");

  // Route changed (including via back/forward, which no click handler sees).
  useEffect(close, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      const el = ref.current;
      if (el?.hasAttribute("open") && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <details ref={ref} className="md:hidden relative">
      <summary className="list-none cursor-pointer p-2 -m-2" aria-label="Open menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full mt-2 w-56 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-xl shadow-xl p-2 flex flex-col">
        {links.map((l) =>
          l.external ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="px-4 py-3 rounded-lg text-sm hover:bg-[color:var(--background)]"
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className="px-4 py-3 rounded-lg text-sm hover:bg-[color:var(--background)]"
            >
              {l.label}
            </Link>
          ),
        )}
      </div>
    </details>
  );
}
