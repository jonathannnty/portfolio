import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Allow loading Next dev assets when visiting from the LAN/Tailscale URL.
  allowedDevOrigins: ["100.83.35.193", "localhost", "127.0.0.1"],
  turbopack: {
    // Keep Next rooted at this app folder to avoid multi-lockfile ambiguity.
    root: path.join(__dirname),
  },
};

export default nextConfig;
