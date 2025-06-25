import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth/callback")
  ) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role

  // Always log for debugging, even in production
  console.log("middleware: token:", token)
  console.log("middleware: role:", role)
  console.log("middleware: pathname:", pathname)

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

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