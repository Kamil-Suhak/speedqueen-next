import type { ImageLoaderProps } from 'next/image';

const normalizeSrc = (src: string) => {
  return src.startsWith('/') ? src.slice(1) : src;
};

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }

  // Keep original unoptimized images during local development
  if (process.env.NODE_ENV === 'development') {
    return `${src}?${params.join('&')}`;
  }

  // Route through Cloudflare's native edge transformation path
  return `/cdn-cgi/image/${params.join(',')}/${normalizeSrc(src)}`;
}
