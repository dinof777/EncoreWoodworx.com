/**
 * Spam screening for the public form endpoints.
 *
 * Layered on purpose, because each layer alone is weak:
 *
 *  1. Honeypot — a field positioned off-screen that no human sees. Bots fill every input
 *     they find. This is the only *definitive* signal here, so a hit is dropped silently
 *     (the bot gets a 200 and no reason to adapt).
 *  2. Dwell time — how long the form was on screen before submitting. A person cannot fill
 *     three fields in under a couple of seconds. Measured client-side as elapsed ms rather
 *     than comparing clocks, so a wrong device clock cannot cause a false positive.
 *  3. Gibberish scoring — the observed spam has a name of random consonants and a message
 *     that is one unbroken token. Deliberately needs several signals to agree.
 *
 * The governing rule: **a false positive costs a real commission, a false negative costs
 * one junk email.** Every threshold here is tuned to let spam through rather than risk
 * turning a customer away, and anything rejected is logged so it can be reviewed.
 */

export type SpamInput = {
  /** Hidden field. Any value means a bot filled it. */
  honeypot?: unknown;
  /** Milliseconds the form was on screen before submit, measured on the client. */
  elapsedMs?: unknown;
  name?: string;
  email?: string;
  message?: string;
};

export type SpamVerdict =
  | { spam: false }
  | {
      spam: true;
      reason: string;
      /** Silent drops answer 200 so the bot learns nothing. */
      silent: boolean;
      /** Shown to a human when not silent. */
      message?: string;
    };

/** Under this, a submission was not typed by a person. Generous on purpose. */
const MIN_DWELL_MS = 2_500;

/**
 * Five or more consonants in a row, e.g. the "Xnrdw" in "Xnrdwywo".
 *
 * Five rather than four deliberately: real surnames reach four ("Schmidt", "Strzelecki")
 * but almost never five, so this catches keyboard-mash without rejecting anyone's actual
 * name. `y` counts as a vowel here, which is the conservative choice.
 */
function consonantRun(text: string): boolean {
  return /[bcdfghjklmnpqrstvwxz]{5,}/i.test(text);
}

/** Random-case alphanumeric with no spaces or punctuation, e.g. "MUjzvywecJPoUOHhqYnA". */
function looksGenerated(text: string): boolean {
  if (text.length < 12) return false;
  if (/\s/.test(text)) return false;
  if (!/^[a-z0-9]+$/i.test(text)) return false;
  const switches = [...text].filter(
    (c, i, a) => i > 0 && /[a-z]/i.test(c) && /[a-z]/i.test(a[i - 1]) && (c === c.toUpperCase()) !== (a[i - 1] === a[i - 1].toUpperCase()),
  ).length;
  return switches >= 3;
}

export function screen(input: SpamInput): SpamVerdict {
  // 1. Honeypot — definitive.
  if (typeof input.honeypot === "string" && input.honeypot.trim() !== "") {
    return { spam: true, reason: "honeypot filled", silent: true };
  }

  // 2. Dwell time. A missing value means the form JS never ran, which is itself a bot
  //    signal — but treat it as recoverable rather than silent, in case of an odd client.
  const elapsed = typeof input.elapsedMs === "number" ? input.elapsedMs : null;
  if (elapsed === null || elapsed < MIN_DWELL_MS) {
    return {
      spam: true,
      reason: `dwell ${elapsed === null ? "absent" : `${elapsed}ms`}`,
      silent: false,
      message: "That went through a little too fast — please try sending it again.",
    };
  }

  // 3. Gibberish scoring — several signals must agree.
  const name = (input.name ?? "").trim();
  const message = (input.message ?? "").trim();
  const email = (input.email ?? "").trim();

  let score = 0;
  const hits: string[] = [];
  if (consonantRun(name)) { score += 2; hits.push("vowelless name"); }
  if (looksGenerated(message)) { score += 2; hits.push("generated message"); }
  if (message.length >= 12 && !/\s/.test(message)) { score += 1; hits.push("message has no spaces"); }
  // Gmail ignores dots, so heavy dotting is a throwaway-address tell — weak on its own.
  const local = email.split("@")[0] ?? "";
  if ((local.match(/\./g)?.length ?? 0) >= 4) { score += 1; hits.push("dotted local part"); }
  if (/\b(https?:\/\/|\[url|viagra|casino|crypto\s*invest)/i.test(message)) { score += 3; hits.push("link or payload"); }

  if (score >= 4) {
    return { spam: true, reason: `score ${score} (${hits.join(", ")})`, silent: true };
  }

  return { spam: false };
}
