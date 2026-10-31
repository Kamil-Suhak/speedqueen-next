import type { ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }

  // Cloudflare Image Resizing (/cdn-cgi/image/) is only enabled on custom zone domains (e.g. speedqueenkrk.pl).
  // On workers.dev preview environments or local development, fall back to direct unoptimized static assets.
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_BASE_URL?.includes("workers.dev") ||
    (typeof window !== "undefined" && window.location.hostname.endsWith(".workers.dev"))
  ) {
    return src;
  }

  // Route through Cloudflare's native edge transformation path
  return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
