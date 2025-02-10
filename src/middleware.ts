import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const { data: { session }, error } = await supabase.auth.getSession()
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isPublicRoute = 
    request.nextUrl.pathname === '/' || 
    request.nextUrl.pathname.startsWith('/pricing') ||
    request.nextUrl.pathname.startsWith('/features') ||
    request.nextUrl.pathname.startsWith('/docs') ||
    request.nextUrl.pathname.startsWith('/api')

  // Session validation and redirection logic
  if (!session) {
    if (isDashboardRoute) {
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    if (isAuthRoute || isLoginRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Store trial plan selection securely
  if (request.nextUrl.searchParams.get('plan') === 'trial') {
    response.cookies.set('selected_plan', 'trial', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 // 1 hour
    })
  }

  // Allow public routes and API routes
  if (isPublicRoute) {
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}