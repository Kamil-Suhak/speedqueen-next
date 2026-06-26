import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader-cloudflare.ts',
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
