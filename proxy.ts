import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
          const cookiesToSet = setCookieHeader.split(/,\s*(?=[^;]+=)/);
          cookiesToSet.forEach((cookieStr) => {
            const [cookiePart] = cookieStr.split(";");
            const [name, value] = cookiePart.split("=");
            if (name && value) {
              res.cookies.set(name.trim(), value.trim());
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
