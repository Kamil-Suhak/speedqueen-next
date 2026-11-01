import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "pl"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
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

    // Redirect directly without trailing slash to prevent double redirect, preserving query params
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname =
      pathname === "/"
        ? `/${locale}`
        : `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

    const response = NextResponse.redirect(redirectUrl);
    if (process.env.IS_PREVIEW === "true") {
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    }
    return response;
  }

  const response = NextResponse.next();
  if (process.env.IS_PREVIEW === "true") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

export const config = {
  // Matcher ignoring internal Next.js paths and common static assets (including Cloudflare cdn-cgi)
  matcher: [
    "/((?!api|_next/static|_next/image|cdn-cgi|images|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
