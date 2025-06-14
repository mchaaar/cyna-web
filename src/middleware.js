import { NextResponse } from 'next/server'

export function middleware(request) {
    const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true'

    if (!authEnabled) return NextResponse.next()

    const path = request.nextUrl.pathname
    const isPublic = ['/login', '/register'].includes(path)
    const token = request.cookies.get('token')?.value

    if (isPublic && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: ['/dashboard/:path*']
}
