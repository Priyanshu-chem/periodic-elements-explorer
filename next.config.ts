import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  headers: async () => [
    {
      source: "/manifest.json",
      headers: [{ key: "Content-Type", value: "application/manifest+json" }],
    },
  ],
};

export default nextConfig;
