import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com", // Google profile photo host
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
