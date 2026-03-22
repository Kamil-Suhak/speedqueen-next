"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu, X, Globe, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalConfig } from "@/config/site-config";
import { useActiveSection } from "@/hooks/useActiveSelection";
import Image from "next/image";

interface NavbarProps {
  links: { label: string; href: string }[];
  ctaText: string;
  brandName: string;
  lang: string;
}

export default function Navbar({ links, brandName, lang, ctaText }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lang]);

  const sectionIds = useMemo(
    () => links.map((link) => link.href.replace("#", "")).concat("hero"),
    [links]
  );
  const activeSection = useActiveSection(sectionIds);

  const togglePath = pathname.startsWith("/pl")
    ? pathname.replace("/pl", "/en")
    : pathname.replace("/en", "/pl");

  const isSolid = scrolled || isOpen;

  const renderNavLink = (link: { label: string; href: string }, isInsideRed = false) => {
    const isAnchor = link.href.startsWith("#");
    const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
    const href = isAnchor
      ? (isHomePage ? link.href : `/${lang}${link.href}`)
      : `/${lang}${link.href}`;

    const isActive = isAnchor
      ? activeSection === link.href.replace("#", "")
      : pathname === `/${lang}${link.href}`;

    return (
      <Link
        key={link.label}
        href={href}
        className={`relative pb-1 text-sm font-bold uppercase tracking-tight transition-all duration-300 ease-in-out group ${isActive
          ? (isInsideRed ? "text-white" : "text-brand-red")
          : (isInsideRed ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-brand-red")
          }`}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="relative z-10">{link.label}</span>
        {isActive ? (
          <motion.div
            layoutId="activeNavUnderline"
            className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isInsideRed ? "bg-white" : "bg-brand-red"}`}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
          />
        ) : (
          <span className={`absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full ${isInsideRed ? "bg-white" : "bg-brand-red"}`} />
        )}
      </Link>
    );
  };

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white/95 py-3 shadow-md backdrop-blur-md border-b border-gray-100"
        : isOpen
          ? "bg-white py-5 shadow-sm"
          : "bg-transparent py-5"
        }`}
      aria-label="Menu"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href={`/${lang}`} className="group flex items-center" aria-label={brandName}>
            <div className="relative w-40 h-10">
              <Image
                src="/images/logo-big-white.png"
                alt={brandName}
                // fill
                width={200}
                height={50}
                className={`object-contain object-left`}
                style={{
                  filter: (scrolled || isOpen)
                    ? "invert(100%) invert(20%) sepia(93%) saturate(4683%) hue-rotate(349deg) brightness(94%) contrast(94%)"
                    : "none",
                }}
                priority
              />
            </div>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            {/* Pill 1: Standard Nav Links */}
            <div className="flex items-center gap-6 bg-brand-red px-6 py-2.5 rounded-full shadow-md">
              {links
                .filter((link) => !link.href.includes("gallery"))
                .map((link) => renderNavLink(link, true))}
            </div>

            {/* Pill 2: Separate Gallery Link */}
            {links.some((link) => link.href.includes("gallery")) && (
              <div className="flex items-center bg-brand-red px-6 py-2.5 rounded-full shadow-md">
                {renderNavLink(links.find((link) => link.href.includes("gallery"))!, true)}
              </div>
            )}

            {/* Pill 3: Language Switcher */}
            <Link
              href={togglePath}
              scroll={false}
              className="flex items-center gap-2 bg-brand-red px-5 py-2.5 rounded-full shadow-md text-sm font-bold tracking-tight text-white uppercase transition hover:text-zinc-200"
              aria-label="Switch language"
            >
              <Globe size={14} aria-hidden="true" />
              {lang === "en" ? "PL" : "EN"}
            </Link>

            <a
              href={`tel:${GlobalConfig.brand.phone}`}
              className="flex transform items-center justify-center gap-2 rounded-xl px-6 py-2.5 bg-brand-red text-white text-sm font-bold shadow-md transition hover:bg-brand-red/90 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-tight outline-none focus:ring-4 focus:ring-brand-red/20"
            >
              <Phone size={16} aria-hidden="true" />
              {ctaText}
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {/* Language Switcher Pill */}
            <Link
              href={togglePath}
              className="flex items-center justify-center bg-brand-red px-4 py-2 rounded-full shadow-md text-xs font-bold text-white uppercase transition hover:text-zinc-200"
              scroll={false}
              aria-label="Switch language"
            >
              {lang === "en" ? "PL" : "EN"}
            </Link>

            {/* Hamburger (Dropdown) Pill */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center bg-brand-red p-2.5 rounded-full shadow-md text-white transition-transform duration-200 active:scale-95"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-gray-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 pt-2 pb-8">
              {links
                .filter((link) => !link.href.includes("gallery"))
                .map((link, index, array) => {
                  const isAnchor = link.href.startsWith("#");
                  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
                  const href = isAnchor
                    ? (isHomePage ? link.href : `/${lang}${link.href}`)
                    : `/${lang}${link.href}`;

                  const isActive = isAnchor
                    ? activeSection === link.href.replace("#", "")
                    : pathname === `/${lang}${link.href}`;

                  const isLast = index === array.length - 1;
                  const hasGallery = links.some((l) => l.href.includes("gallery"));
                  const showBottomBorder = !isLast || !hasGallery;

                  return (
                    <Link
                      key={link.label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-5 text-lg font-bold uppercase tracking-tight transition-colors ${showBottomBorder ? "border-b-2 border-brand-red/20" : ""
                        } ${isActive ? "text-brand-red" : "text-gray-900 active:text-brand-red"}`}
                    >
                      <div className="relative inline-block">
                        <span>{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeNavUnderlineMobile"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-red rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 40 }}
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}

              {links
                .filter((link) => link.href.includes("gallery"))
                .map((link) => {
                  const isAnchor = link.href.startsWith("#");
                  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
                  const href = isAnchor
                    ? (isHomePage ? link.href : `/${lang}${link.href}`)
                    : `/${lang}${link.href}`;

                  const isActive = isAnchor
                    ? activeSection === link.href.replace("#", "")
                    : pathname === `/${lang}${link.href}`;

                  return (
                    <div key={link.label} className="border-t-2 border-brand-red mt-2">
                      <Link
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-5 text-lg font-bold uppercase tracking-tight transition-colors ${isActive ? "text-brand-red" : "text-gray-900 active:text-brand-red"
                          }`}
                      >
                        <div className="relative inline-block">
                          <span>{link.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="activeNavUnderlineMobile"
                              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-red rounded-full"
                              transition={{ type: "spring", stiffness: 380, damping: 40 }}
                            />
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              <div className="pt-4">
                <a
                  href={`tel:${GlobalConfig.brand.phone}`}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-red py-4 font-bold text-white text-lg shadow-md hover:bg-brand-red/90 hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-tight outline-none focus:ring-4 focus:ring-brand-red/20"
                >
                  <Phone size={20} aria-hidden="true" />
                  {ctaText}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
