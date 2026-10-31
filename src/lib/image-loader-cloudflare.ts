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

  // Cloudflare Image Resizing (/cdn-cgi/image/) is only enabled on custom registered zones (speedqueenkrk.pl).
  // In development, preview (workers.dev), or when explicitly disabled, serve direct unoptimized static assets.
  const isCustomZone =
    process.env.NEXT_PUBLIC_BASE_URL?.includes("speedqueenkrk.pl") &&
    (typeof window === "undefined" || !window.location.hostname.endsWith(".workers.dev"));

  if (!isCustomZone || process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_CF_IMAGE_RESIZING === "false") {
    return src;
  }

  // Route through Cloudflare's native edge transformation path on speedqueenkrk.pl
  return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
