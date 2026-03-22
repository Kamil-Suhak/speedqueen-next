import { Locale } from "@/config/site-config";
import Gallery from "@/components/sections/Gallery";
import { getDictionary } from "@/lib/generate-dictionaries";
import { getSectionBackground } from "@/lib/background-manager";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const gallery = await getDictionary(lang, "gallery");

  return (
    <div className="pt-20"> {/* Add padding top for fixed navbar */}
      <Gallery content={gallery} lang={lang} bgImage={getSectionBackground(3)} />
    </div>
  );
}
