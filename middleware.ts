import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  type AppToken = {
    name?: string
    email?: string
    sub?: string
    role?: string
    [key: string]: unknown
  }

  let token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const vercelJwt = request.cookies.get("_vercel_jwt")?.value
    if (vercelJwt) {
      try {
        const { payload } = await jwtVerify(
          vercelJwt,
          new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
        )
        token = payload as AppToken
      } catch (err) {
        console.error("Failed to verify _vercel_jwt:", err)
      }
    }
  }

  const role = token?.role

  console.log("middleware: token:", token)
  console.log("middleware: role:", role)
  console.log("middleware: pathname:", pathname)
  console.log("middleware: cookies", request.cookies.getAll().map(c => c.name))
  console.log("middleware: NEXTAUTH_SESSION_TOKEN_MODE", process.env.NEXTAUTH_SESSION_TOKEN_MODE)

  const protectedRoutes = [
    "/students",
    "/employers",
    "/admin"
  ]
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (!isProtected) {
    return NextResponse.next()
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
  matcher: [
    // Only match protected routes
    '/students/:path*',
    '/employers/:path*',
    '/admin/:path*',
  ],
}
