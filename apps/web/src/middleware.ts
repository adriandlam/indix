import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Session } from "@index/auth";

export async function middleware(request: NextRequest) {
  try {
    const response = await fetch(
      request.nextUrl.origin + "/api/auth/get-session",
      {
        headers: {
          cookie: request.headers.get("cookie") ?? "", // Forward the cookies from the request
        },
      }
    );
    const data = (await response.json()) as Session;
    const user = data.user;
    const session = data.session as Session["session"] | undefined;

    const isAuthRoute = request.nextUrl.pathname.includes("sign");

    // No session and trying to access protected route -> redirect to sign-in
    if (!session && !isAuthRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Has session and trying to access auth route -> redirect to home
    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/notes", request.url));
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    const isAuthRoute = request.nextUrl.pathname.includes("sign");
    if (!isAuthRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/settings/:path*", "/sign-in", "/sign-up"],
};
