"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalConfig } from "@/config/site-config";
import { useActiveSection } from "@/hooks/useActiveSelection";

interface NavbarProps {
  links: { label: string; href: string }[];
  cta: string;
  brandName: string;
  lang: string;
}

export default function Navbar({ links, brandName, lang, cta }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Detect scroll to change styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lang]);

  const sectionIds = links
    .map((link) => link.href.replace("#", ""))
    .concat("hero"); // Add hero section but don't include it in the nav links
  const activeSection = useActiveSection(sectionIds);

  // Logic to switch language
  const togglePath = pathname.startsWith("/pl")
    ? pathname.replace("/pl", "/en")
    : pathname.replace("/en", "/pl");

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/80 py-3 shadow-sm backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href={`/${lang}`} className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white transition-transform group-hover:rotate-12">
              {brandName.charAt(0)}
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {brandName}
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-blue-600 underline underline-offset-4"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            {/* Language Switcher Button */}
            <Link
              href={togglePath}
              scroll={false}
              className="flex items-center gap-2 border-l border-gray-200 pl-6 text-xs font-bold tracking-widest text-gray-400 uppercase transition hover:text-blue-600"
            >
              <Globe size={14} />
              {lang === "en" ? "PL" : "EN"}
            </Link>

            <a
              href={`tel:${GlobalConfig.brand.phone}`}
              // className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              className="flex transform items-center justify-center gap-2 rounded-full px-5 py-2 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-100 transition hover:bg-blue-700"
            >
              <Phone size={16} />
              {cta}
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-4 md:hidden">
            <Link
              href={togglePath}
              className="text-xs font-bold text-gray-600 uppercase"
              scroll={false}
            >
              {lang === "en" ? "PL" : "EN"}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600"
              aria-label="menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV ANIMATION */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-gray-100 bg-white md:hidden"
          >
            <div className="space-y-2 px-4 pt-2 pb-8">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block border-b border-gray-50 px-3 py-4 text-lg font-semibold text-gray-900"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
