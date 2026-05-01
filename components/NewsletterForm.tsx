"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        className="input flex-1"
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
      {status === "ok" && (
        <p className="sm:absolute sm:translate-y-14 text-sm text-[color:var(--forest)]">
          Thanks — you&apos;re on the list.
        </p>
      )}
      {status === "error" && (
        <p className="sm:absolute sm:translate-y-14 text-sm text-red-700">
          Please enter a valid email.
        </p>
      )}
    </form>
  );
}
