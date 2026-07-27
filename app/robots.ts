import type { MetadataRoute } from "next";

const SITE = "https://encorewoodworx.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Design explorations, not public content — indexing them would put
        // three competing versions of the same copy in the search index.
        disallow: ["/preview/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
