import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as cookie from "cookie";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const isPrivateKey =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  let isAuthenticated = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://notehub-public.goit.study";
      const response = await fetch(`${backendUrl}/api/auth/session`, {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      });

      if (response.ok) {
        isAuthenticated = true;

        const res = NextResponse.next();

        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
          const cookiesArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookiesArray.forEach((cookieStr) => {
            const parsed = cookie.parseSetCookie(cookieStr);
            if (parsed && parsed.name && parsed.value) {
              res.cookies.set({
                name: parsed.name,
                value: parsed.value,
                domain: parsed.domain,
                path: parsed.path,
                maxAge: parsed.maxAge,
                expires: parsed.expires,
                httpOnly: parsed.httpOnly,
                secure: parsed.secure,
                sameSite: parsed.sameSite as
                  | "strict"
                  | "lax"
                  | "none"
                  | undefined,
              });
            }
          });
        }

        if (isAuthRoute) {
          return NextResponse.redirect(new URL("/", request.url));
        }
        return res;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateKey && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && (accessToken || isAuthenticated)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
