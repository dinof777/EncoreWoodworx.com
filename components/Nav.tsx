import Link from "next/link";
import Image from "next/image";
import { BasketButton } from "./BasketButton";
import { MobileMenu } from "./MobileMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "https://photos.app.goo.gl/nanyeNbDvnaD7ujd7", label: "Gallery", external: true },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/shop-tips", label: "Shop Tips" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--background)]/85 border-b border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Encore Woodworx"
            width={96}
            height={65}
            className="h-14 md:h-16 w-auto"
            priority
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display text-2xl text-[color:var(--foreground)]">
              Encore Woodworx
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[color:var(--muted)]">
              Handcrafted, One Piece at a Time
            </span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent-ink)] transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[color:var(--foreground)] hover:text-[color:var(--accent-ink)] transition-colors"
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <BasketButton />
          <Link href="/contact" className="btn btn-primary">
            Start a Project
          </Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <BasketButton />
        </div>
        <MobileMenu links={links} />
      </div>
    </header>
  );
}
