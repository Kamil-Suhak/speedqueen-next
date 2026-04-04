"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu, X, Globe, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalConfig } from "@/config/site-config";
import { useActiveSection } from "@/hooks/useActiveSelection";
import Image from "next/image";
import ObfuscatedLink from "@/components/ui/ObfuscatedLink";

interface NavbarProps {
  links: { label: string; href: string }[];
  ctaText: string;
  brandName: string;
  lang: string;
  hasAnnouncementBar?: boolean;
}

export default function Navbar({
  links,
  brandName,
  lang,
  ctaText,
  hasAnnouncementBar = false,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lang]);

  // Pages with light backgrounds can set data-navbar-theme="dark"
  // on their wrapper to make the logo visible without scrolling
  useEffect(() => {
    const main = document.getElementById("main-content");
    if (!main) return;
    const child = main.querySelector("[data-navbar-theme]");
    setDarkTheme(child?.getAttribute("data-navbar-theme") === "dark");
  }, [pathname]);

  const sectionIds = useMemo(
    () => links.map((link) => link.href.replace("#", "")).concat("hero"),
    [links],
  );
  const activeSection = useActiveSection(sectionIds);

  const togglePath = pathname.startsWith("/pl")
    ? pathname.replace("/pl", "/en")
    : pathname.replace("/en", "/pl");

  const isSolid = scrolled || isOpen || darkTheme;

  const renderNavLink = (
    link: { label: string; href: string },
    isInsideRed = false,
    additionalOnClick?: () => void,
  ) => {
    const isAnchor = link.href.startsWith("#");
    // Normalize pathname for home page check (handles trailing slashes)
    const isHomePage =
      pathname === `/${lang}` ||
      pathname === `/${lang}/` ||
      pathname === `/${lang}/#`;

    /* 
      ROUTING LOGIC:
      - If it's an anchor (#) and we are on the Home Page, we use the hash directly.
      - If it's an anchor but we are on a SUBPAGE, we prepend the lang base (e.g., /en#about) 
        so Next.js navigates back home before scrolling.
      - If it's a standard page link, we always prepend the lang base.
    */
    const href = isAnchor
      ? isHomePage
        ? link.href
        : `/${lang}${link.href}`
      : `/${lang}${link.href}`;

    const isActive = isAnchor
      ? activeSection === link.href.replace("#", "")
      : pathname === `/${lang}${link.href}`;

    // FORCED SCROLL FIX:
    // If the user is on the target page and clicks an anchor link, 
    // we manually scroll to ensure the jump happens even if the URL hash matches.
    const handleLinkClick = (e: React.MouseEvent) => {
      if (isAnchor && isHomePage) {
        const targetId = link.href.replace("#", "");
        const element = document.getElementById(targetId);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth" });
          // Update the URL hash manually if needed, but per plan we keep it simple
          if (additionalOnClick) additionalOnClick();
        }
      } else if (additionalOnClick) {
        // For mobile menu typically to close the drawer
        additionalOnClick();
      }
    };

    const desktopClasses = `relative pb-1 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ease-in-out group whitespace-nowrap ${
      isActive
        ? isInsideRed
          ? "text-white"
          : "text-brand-primary"
        : isInsideRed
          ? "text-white/80 hover:text-white"
          : "text-gray-600 hover:text-brand-primary"
    }`;

    const mobileClasses = `block px-3 py-5 text-lg font-bold uppercase tracking-tight transition-colors border-b-2 border-brand-primary/20 ${
      isActive
        ? "text-brand-primary"
        : "text-gray-900 active:text-brand-primary"
    }`;

    return (
      <Link
        key={link.label}
        href={href}
        onClick={handleLinkClick}
        className={isInsideRed ? desktopClasses : mobileClasses}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="relative inline-block z-10">
          <span>{link.label}</span>
          {isActive && (
            <motion.div
              layoutId={
                isInsideRed
                  ? "activeNavUnderline"
                  : "activeNavUnderlineMobile"
              }
              className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                isInsideRed ? "bg-white" : "bg-brand-primary"
              }`}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
            />
          )}
          {!isActive && isInsideRed && (
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-[width] duration-300 group-hover:w-full ${
                isInsideRed ? "bg-white" : "bg-brand-primary"
              }`}
            />
          )}
        </div>
      </Link>
    );
  };

  return (
    <nav
      style={{ top: hasAnnouncementBar && !scrolled ? "20px" : "0px" }}
      className={`fixed z-50 w-full transition-[background-color,padding,box-shadow,border-color,backdrop-filter,top] duration-300 ${
        scrolled
          ? "bg-white/95 py-3 shadow-md backdrop-blur-md border-b border-gray-100"
          : isOpen
            ? "bg-white py-5 shadow-sm"
            : "bg-transparent py-5"
      }`}
      aria-label="Menu"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="group flex items-center -ml-2"
            aria-label={brandName}
          >
            <div className="relative w-40 h-10">
              <Image
                src="/images/logo-big-white.png"
                alt={brandName}
                // fill
                width={200}
                height={50}
                className={`object-contain object-left`}
                style={{
                  filter: isSolid
                    ? "invert(100%) invert(20%) sepia(93%) saturate(4683%) hue-rotate(349deg) brightness(94%) contrast(94%)"
                    : "none",
                }}
                priority
              />
            </div>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-4 bg-brand-primary px-5 py-2.5 rounded-full shadow-md">
              <div className="flex items-center gap-5">
                {links
                  .filter((link) => !link.href.includes("gallery"))
                  .map((link) => renderNavLink(link, true))}
              </div>

              {links.some((link) => link.href.includes("gallery")) && (
                <>
                  <div
                    className="h-5 w-[2px] bg-white/60 mx-1"
                    aria-hidden="true"
                  />
                  {renderNavLink(
                    links.find((link) => link.href.includes("gallery"))!,
                    true,
                  )}
                </>
              )}
            </div>

            <Link
              href={togglePath}
              scroll={false}
              className="flex items-center gap-2 bg-brand-primary px-4 py-2.5 rounded-full shadow-md text-sm font-bold tracking-wide text-white uppercase transition-colors hover:text-zinc-200"
              aria-label="Switch language"
            >
              <Globe size={14} aria-hidden="true" />
              {lang === "en" ? "PL" : "EN"}
            </Link>

            <ObfuscatedLink
              type="phone"
              useGlobalConfig={true}
              className="flex transform items-center justify-center gap-2 rounded-xl px-4 py-2.5 bg-brand-primary text-white text-sm font-bold shadow-md transition-[background-color,transform] hover:bg-brand-primary/90 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-tight outline-none focus:ring-4 focus:ring-brand-primary/20 whitespace-nowrap"
            >
              <Phone size={16} aria-hidden="true" />
              {ctaText}
            </ObfuscatedLink>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {/* Language Switcher Pill */}
            <Link
              href={togglePath}
              className="flex items-center justify-center bg-brand-primary px-4 py-2 rounded-full shadow-md text-xs font-bold text-white uppercase transition-colors hover:text-zinc-200"
              scroll={false}
              aria-label="Switch language"
            >
              {lang === "en" ? "PL" : "EN"}
            </Link>

            {/* Hamburger (Dropdown) Pill */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center bg-brand-primary p-2.5 rounded-full shadow-md text-white transition-transform duration-200 active:scale-95"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`grid md:hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
      >
        <div className="overflow-hidden border-b border-gray-100 bg-white">
          <div className="space-y-1 px-4 pt-2 pb-8">
            {links
              .filter((link) => !link.href.includes("gallery"))
              .map((link) => renderNavLink(link, false, () => setIsOpen(false)))}

            {links
              .filter((link) => link.href.includes("gallery"))
              .map((link) => (
                <div
                  key={link.label}
                  className="border-t-2 border-brand-primary mt-2"
                >
                  {renderNavLink(link, false, () => setIsOpen(false))}
                </div>
              ))}
            <div className="pt-4">
              <ObfuscatedLink
                type="phone"
                useGlobalConfig={true}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-primary py-4 font-bold text-white text-lg shadow-md hover:bg-brand-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-[background-color,transform] uppercase tracking-tight outline-none focus:ring-4 focus:ring-brand-primary/20"
              >
                <Phone size={20} aria-hidden="true" />
                {ctaText}
              </ObfuscatedLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

