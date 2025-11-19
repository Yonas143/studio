import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('is-logged-in')

    if (!isLoggedIn && (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/judge'))) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/judge/:path*'],
}
