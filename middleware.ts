import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/sign-in" ||
    pathname === "/sign-in/" ||
    pathname === "/forbidden"
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role

  if (pathname.startsWith("/employers") && role !== "employer") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  if (pathname.startsWith("/students") && role !== "student") {
    return NextResponse.redirect(new URL("/forbidden", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/employers/:path*", "/students/:path*"],
}