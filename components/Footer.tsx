import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[color:var(--border)] bg-[color:var(--surface)]/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 max-w-sm">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Encore Woodworx" width={72} height={49} className="h-12 w-auto" />
            <span className="font-display text-2xl">Encore Woodworx</span>
          </div>
          <p className="mt-5 pl-4 border-l-2 border-[color:var(--accent)] font-display italic text-xl leading-snug">
            When your roots are deep, there is no reason to fear the wind.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
            One shop, one pair of hands — blacksmithing to fine carpentry. If you can dream
            it, I&apos;ll build it.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.facebook.com/dino.flora"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-[color:var(--border)] flex items-center justify-center hover:bg-[color:var(--accent)] hover:text-[color:var(--surface)] hover:border-[color:var(--accent)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12H16l-.4 2.9h-2.2v7A10 10 0 0 0 22 12Z"/></svg>
            </a>
            <a
              href="https://www.instagram.com/dinof777/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-[color:var(--border)] flex items-center justify-center hover:bg-[color:var(--accent)] hover:text-[color:var(--surface)] hover:border-[color:var(--accent)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-[color:var(--accent)]" href="/services">Services</Link></li>
            <li><Link className="hover:text-[color:var(--accent)]" href="/shop">Shop</Link></li>
            <li><a className="hover:text-[color:var(--accent)]" href="https://photos.app.goo.gl/nanyeNbDvnaD7ujd7" target="_blank" rel="noopener noreferrer">Gallery</a></li>
            <li><Link className="hover:text-[color:var(--accent)]" href="/shop-tips">Shop Tips</Link></li>
            <li><Link className="hover:text-[color:var(--accent)]" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Visit</h3>
          <ul className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
            <li className="text-[color:var(--foreground)] font-medium">Mon–Fri · 10am – 7pm</li>
            <li>Sat–Sun · 10am – 6pm</li>
          </ul>
          <Link href="/contact" className="mt-5 btn btn-ghost text-xs">Get a quote</Link>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[color:var(--muted)]">
          <p>© {year} Encore Woodworx. All rights reserved.</p>
          <p>Handcrafted in the workshop. Built with care.</p>
        </div>
      </div>
    </footer>
  );
}
