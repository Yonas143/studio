import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isLoggedIn = request.cookies.get('is-logged-in')
    const userRole = request.cookies.get('user-role')?.value

    // Check if trying to access protected routes
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')


    // Redirect to login if not authenticated
    if (!isLoggedIn && isAdminRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check role-based access
    if (isLoggedIn) {
        if (isAdminRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
