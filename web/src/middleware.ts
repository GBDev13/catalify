import { NextRequest, NextResponse } from "next/server";
import { LOCALHOST_URL } from "./constants/config";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /examples (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|examples/|images/|scripts/|sheets/|videos/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || "catalify.com.br";

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
      console.log('process.env.VERCEL', process.env.VERCEL)
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.catalify.com.br`, "")
      : hostname.replace(`.${LOCALHOST_URL}`, "");

  // rewrites for app pages
  if (currentHost == "app") {
    url.pathname = `/app${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  console.log('hostname', hostname)
  console.log('currentHost', currentHost)

  // rewrite root application to `/home` folder
  if (hostname === LOCALHOST_URL || hostname === 'catalify.com.br' || hostname === 'www.catalify.com.br') {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/_sites/[site] dynamic route
  return NextResponse.rewrite(
    new URL(`/_sites/${currentHost}${path}`, req.url)
  );
}
