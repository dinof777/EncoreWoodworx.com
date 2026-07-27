import { formResponseUrl, type GoogleFormConfig } from "./google-form";

/**
 * Where the site's two forms deliver.
 *
 * These ids are deliberately in source rather than environment variables: a Google Form's
 * URL and its `entry.<id>` field names are public by construction — anyone can read them
 * out of the form's own HTML — so there is no secret to protect, and keeping them here
 * means there is no "did the env var get set in production?" failure mode.
 *
 * Field ids come from the published form's FB_PUBLIC_LOAD_DATA_ payload. To re-read them
 * after editing a form, fetch its /viewform URL and parse that blob.
 */

/** "EncoreWoodWorx Project Form" — commission inquiries from /contact and /basket. */
export const PROJECT_FORM: GoogleFormConfig = {
  action: formResponseUrl(
    "https://docs.google.com/forms/d/e/1FAIpQLSfbJNkzUSLFqou-OpGRXLye5ucLCXRitPJWucjn_jXqM9JSLw/viewform",
  ),
  fields: {
    name: "entry.42216070", // "Full Name"
    email: "entry.292983155", // "Email Address"
    details: "entry.107820641", // "Additional Project Details"
    // entry.374281797 ("Which project components do you require") is a checkboxes
    // question still carrying Google's stock web-agency options, which cannot accept
    // arbitrary product titles. The basket is folded into `details` instead. If that
    // question becomes a Paragraph, add `pieces: "entry.374281797"` here and split it
    // back out in buildProjectDetails().
  },
};

/**
 * Newsletter sign-ups. Not yet created — the route reports "not configured" and the
 * form tells visitors sign-up is coming rather than pretending they subscribed.
 * To enable: create a one-question Google Form, then fill this in.
 */
export const NEWSLETTER_FORM: GoogleFormConfig | null = null;

export type BasketEntry = { title?: string; priceLabel?: string };

/**
 * Fold the written message and the project basket into the single free-text field the
 * form exposes, so nothing a visitor sent is lost.
 */
export function buildProjectDetails(message: string, basket: BasketEntry[]): string {
  const parts: string[] = [];
  if (message) parts.push(message);
  if (basket.length > 0) {
    const lines = basket.map(
      (b, i) => `  ${i + 1}. ${(b.title ?? "Untitled").slice(0, 200)} (${b.priceLabel ?? "—"})`,
    );
    parts.push(`Pieces in their project basket (${basket.length}):\n${lines.join("\n")}`);
  }
  return parts.join("\n\n");
}
