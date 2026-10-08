import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

const memberRoutes = [
  "/dashboard",
  "/profile",
  "/announcements",
  "/calendar",
  "/member",
  "/my-activities",
  "/officer",
  "/settings",
];
const authRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  try {
    const { supabaseUrl, supabasePublishableKey } = getPublicEnv();
    const response = NextResponse.next({ request });

    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabasePublishableKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;
    const isMemberRoute = memberRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    const isAuthRoute = authRoutes.includes(pathname);

    if (isMemberRoute && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    console.error("Supabase proxy auth check failed:", error);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/announcements/:path*",
    "/calendar/:path*",
    "/member/:path*",
    "/my-activities/:path*",
    "/officer/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
