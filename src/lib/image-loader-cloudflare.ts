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

  // Cloudflare Image Resizing (/cdn-cgi/image/) is only enabled on custom registered zones (speedqueenkrk.pl).
  // In development, preview (workers.dev, or dev.speedqueenkrk.pl behind Cloudflare Access),
  // or when explicitly disabled, serve direct unoptimized static assets.
  const isDevOrPreview =
    process.env.NODE_ENV === "development" ||
    process.env.IS_PREVIEW === "true" ||
    process.env.NEXT_PUBLIC_CF_IMAGE_RESIZING === "false" ||
    (typeof window !== "undefined" &&
      (window.location.hostname.endsWith(".workers.dev") ||
        window.location.hostname.startsWith("dev.")));

  if (isDevOrPreview) {
    return src;
  }

  const params = [`width=${width}`, "format=auto"];
  if (quality) {
    params.push(`quality=${quality}`);
  }

  // Route through Cloudflare's native edge transformation path on speedqueenkrk.pl
  return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
