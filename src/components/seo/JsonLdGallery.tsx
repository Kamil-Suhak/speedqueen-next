import { GlobalConfig } from "@/config/site-config";

interface GalleryImage {
  src: string;
  alt: string;
}

interface JsonLdGalleryProps {
  images: GalleryImage[];
  galleryName: string;
  galleryDescription: string;
}

export default function JsonLdGallery({
  images,
  galleryName,
  galleryDescription,
}: JsonLdGalleryProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: galleryName,
    description: galleryDescription,
    url: `${GlobalConfig.brand.url}/gallery`,
    image: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: `${GlobalConfig.brand.url}${img.src}`,
      description: img.alt,
    })),
    isPartOf: {
      "@type": "WebSite",
      "@id": `${GlobalConfig.brand.url}/#website`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

