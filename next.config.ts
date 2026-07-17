import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@swisseph/browser", "@swisseph/core"],
};

export default nextConfig;
