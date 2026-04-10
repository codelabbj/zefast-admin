import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const { pathname } = req.nextUrl

  // Allow static files and api
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === "/login"
  const isRootPage = pathname === "/"

  if (!token && !isLoginPage && !isRootPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/:path*"],
}

