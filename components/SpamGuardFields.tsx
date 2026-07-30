"use client";

import { useEffect, useRef } from "react";

/**
 * The client half of spam screening (see lib/spam.ts).
 *
 * Renders a honeypot input that no human can see or tab into, and exposes how long the
 * form has been on screen. Call `elapsedMs()` when submitting and send both values.
 */
export function useSpamGuard() {
  const mountedAt = useRef<number | null>(null);
  const honeypot = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  return {
    honeypotRef: honeypot,
    /** Never a clock comparison — always an elapsed duration measured on this device. */
    elapsedMs: () => (mountedAt.current === null ? 0 : Date.now() - mountedAt.current),
    honeypotValue: () => honeypot.current?.value ?? "",
  };
}

/**
 * Positioned off-screen rather than `display:none` — some bots skip hidden inputs, but
 * almost none check computed position. `tabIndex={-1}` and `aria-hidden` keep it away from
 * keyboard and screen-reader users, and autoComplete="off" stops browsers filling it.
 */
export function HoneypotField({ inputRef }: { inputRef: React.Ref<HTMLInputElement> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="company-website">Company (leave blank)</label>
      <input
        ref={inputRef}
        id="company-website"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
