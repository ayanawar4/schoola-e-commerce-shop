import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "schoola.serveftp.com" },
      { protocol: "http", hostname: "schoola.serveftp.com" },
      { protocol: "http", hostname: "137.184.57.162" },
      { protocol: "https", hostname: "137.184.57.162" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
