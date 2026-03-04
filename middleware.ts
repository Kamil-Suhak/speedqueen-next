import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "pl"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // 2. Redirect if there is no locale (e.g. "/" or "/about")
  if (pathnameIsMissingLocale) {
    const acceptLanguage = request.headers.get("accept-language");
    let locale = defaultLocale;

    if (acceptLanguage) {
      const preferredLocales = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0]);

      const matchedLocale = preferredLocales.find((lang) =>
        locales.includes(lang),
      );

      if (matchedLocale) {
        locale = matchedLocale;
      }
    }

    // e.g. redirect "/" to "/en" or "/pl"
    // We use a permanent redirect (308) or temporary (307)
    // For local dev, 307 is safer to avoid browser caching issues
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? pathname : "/" + pathname}`,
        request.url,
      ),
    );
  }
}

export const config = {
  // Matcher ignoring internal Next.js paths and common static assets
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml).*)"],
};
