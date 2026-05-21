import { NextRequest, NextResponse } from "next/server";
import { getRedirectTarget } from "./lib/locale-routing";

export function proxy(req: NextRequest) {
  // Only redirect GET/HEAD — preserve CORS preflight, mutations, etc.
  if (req.method !== "GET" && req.method !== "HEAD") return;

  const target = getRedirectTarget(req.nextUrl.pathname);
  if (!target) return;

  const url = req.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Exclude api routes, Next.js internals, and any path with extension (assets)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
