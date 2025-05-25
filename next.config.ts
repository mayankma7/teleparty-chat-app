import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { unoptimized: true },
  basePath: "/teleparty-chat-app",
  output: "export",
};
export default nextConfig;
