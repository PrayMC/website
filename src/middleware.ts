import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Stays `middleware.ts` (Edge): @opennextjs/cloudflare cannot bundle Next 16's Node-runtime `proxy.ts`.
const intl = createMiddleware(routing);

// Report-Only until the console is quiet, then rename to "Content-Security-Policy".
const CSP_HEADER = "Content-Security-Policy-Report-Only";

function buildCsp(nonce: string) {
  const dev = process.env.NODE_ENV === "development"; // dev bundles need eval
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://api.mcheads.org",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

export default function middleware(request: NextRequest) {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const csp = buildCsp(nonce);
  // Next reads the nonce from the *request* header and stamps it on its inline scripts.
  const headers = new Headers(request.headers);
  headers.set(CSP_HEADER, csp);
  const response = intl(new NextRequest(request, { headers }));
  response.headers.set(CSP_HEADER, csp);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
