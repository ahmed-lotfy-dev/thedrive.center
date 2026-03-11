import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allowing all for flexibility with R2 custom domains or generic domains for now, ideally restrict to R2 public URL
      },
    ],
  },
};

export default nextConfig;

