import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const acceptLanguage = request.headers.get("accept-language");

    // default to english
    let locale = "en";

    if (acceptLanguage) {
      const preferredLanguages = acceptLanguage.split(",");

      // get highest prio
      const primaryPart = preferredLanguages[0];

      // ["en", "q=0.9"] -> we take "en"
      const primaryLang = primaryPart.split(";")[0].trim().toLowerCase();

      // 4. Check if the primary language starts with 'pl' (handles 'pl' or 'pl-PL')
      if (primaryLang.startsWith("pl")) {
        locale = "pl";
      }
    }

    const url = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
