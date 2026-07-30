import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // florabrothers.com resolves to this same deployment. Serving byte-identical HTML on two
  // domains split the search signals and had Google surfacing the legacy name, so the old
  // domain now folds into the brand one, path and all.
  //
  // 308 permanent, which is what transfers ranking to the destination — but browsers cache
  // it hard, so reversing this later will not un-redirect anyone who has already hit it.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?florabrothers\\.com" }],
        destination: "https://www.encorewoodworx.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.etsystatic.com" },
      { protocol: "https", hostname: "img1.wsimg.com" },
    ],
  },
};

export default nextConfig;
