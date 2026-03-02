import { GlobalConfig, dictionaries } from "@/config/site-config";

interface FooterProps {
  brand: typeof GlobalConfig.brand;
  socials: typeof GlobalConfig.socials;
}

export default function Footer({ brand, socials }: FooterProps) {
  return (
    <footer className="border-t border-gray-100 bg-white pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {brand.name}.
          </p>
          <div className="flex gap-6">
            {socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                rel="noopener noreferrer"
                className="text-sm text-gray-400 transition hover:text-gray-900"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
