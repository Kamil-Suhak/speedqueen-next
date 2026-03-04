"use client";

import { useState, useEffect } from "react";
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

  const sectionIds = links
    .map((link) => link.href.replace("#", ""))
    .concat("hero");
  const activeSection = useActiveSection(sectionIds);

  const togglePath = pathname.startsWith("/pl")
    ? pathname.replace("/pl", "/en")
    : pathname.replace("/en", "/pl");

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 py-3 shadow-md backdrop-blur-md border-b border-gray-100"
          : "bg-transparent py-5"
      }`}
      aria-label="Menu"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href={`/${lang}`} className="group flex items-center gap-2" aria-label={brandName}>
            <div className="relative h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-105">
              <Image 
                src={GlobalConfig.brand.logo} 
                alt="" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tighter text-gray-900 md:block hidden">
              {brandName}
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-tight transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-brand-red border-b-2 border-brand-red"
                      : "text-gray-600 hover:text-brand-red"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              );
            })}

            <Link
              href={togglePath}
              scroll={false}
              className="flex items-center gap-2 border-l border-gray-200 pl-6 text-xs font-bold tracking-widest text-gray-400 uppercase transition hover:text-brand-red"
              aria-label="Switch language"
            >
              <Globe size={14} aria-hidden="true" />
              {lang === "en" ? "PL" : "EN"}
            </Link>

            <a
              href={`tel:${GlobalConfig.brand.phone}`}
              className="flex transform items-center justify-center gap-2 rounded-xl px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold shadow-lg transition hover:bg-brand-red hover:-translate-y-0.5 uppercase tracking-tight"
            >
              <Phone size={16} aria-hidden="true" />
              {ctaText}
            </a>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <Link
              href={togglePath}
              className="text-xs font-bold text-gray-600 uppercase"
              scroll={false}
              aria-label="Switch language"
            >
              {lang === "en" ? "PL" : "EN"}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-brand-red transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
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
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block border-b border-gray-50 px-3 py-5 text-lg font-bold text-gray-900 uppercase tracking-tight"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4">
                <a
                   href={`tel:${GlobalConfig.brand.phone}`}
                   className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-red py-4 font-bold text-white text-lg shadow-lg"
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
