import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Try to get the session
  const { data: { session }, error } = await supabase.auth.getSession()

  // Define route types
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isPublicRoute = 
    request.nextUrl.pathname === '/' || 
    request.nextUrl.pathname.startsWith('/pricing') ||
    request.nextUrl.pathname.startsWith('/features') ||
    request.nextUrl.pathname.startsWith('/docs') ||
    request.nextUrl.pathname.startsWith('/api')

  // Get stored plan and return URL
  const storedPlan = request.cookies.get('selected_plan')
  const returnUrl = request.nextUrl.searchParams.get('returnUrl')
  const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')

  // Try to refresh the session if it exists but is expired
  if (session?.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
    const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
    if (refreshedSession) {
      // Update the session in the response
      response.cookies.set('sb-access-token', refreshedSession.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
      response.cookies.set('sb-refresh-token', refreshedSession.refresh_token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
    }
  }

  // Handle session state and redirects
  if (!session) {
    // User is not authenticated
    if (isDashboardRoute) {
      // Store the original URL they were trying to access
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      
      // If there was a stored plan, maintain it through the redirect
      if (storedPlan?.value === 'trial') {
        redirectUrl.searchParams.set('plan', 'trial')
      }
      
      // Store the return URL in a cookie for persistence
      response.cookies.set('auth_redirect_url', request.nextUrl.pathname, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hour
        path: '/'
      })
      
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // User is authenticated
    if (isAuthRoute || isLoginRoute) {
      // Determine where to redirect the authenticated user
      let redirectTo = '/dashboard'
      
      // Priority order: returnUrl -> stored redirect -> callbackUrl -> dashboard
      if (returnUrl && !returnUrl.startsWith('/auth') && !returnUrl.startsWith('/login')) {
        redirectTo = returnUrl
      } else {
        const storedRedirect = request.cookies.get('auth_redirect_url')
        if (storedRedirect?.value && !storedRedirect.value.startsWith('/auth') && !storedRedirect.value.startsWith('/login')) {
          redirectTo = storedRedirect.value
          // Clear the stored redirect URL
          response.cookies.delete('auth_redirect_url')
        } else if (callbackUrl && !callbackUrl.startsWith('/auth') && !callbackUrl.startsWith('/login')) {
          redirectTo = callbackUrl
        }
      }
      
      // If there's a trial plan, redirect to billing
      if (storedPlan?.value === 'trial') {
        redirectTo = '/dashboard/billing?plan=trial'
      }
      
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  // Handle trial plan selection
  if (request.nextUrl.searchParams.get('plan') === 'trial') {
    // Store trial plan selection in a secure HTTP-only cookie
    response.cookies.set('selected_plan', 'trial', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    })
  }

  // Store the last authenticated page for better redirect handling
  if (session && !isAuthRoute && !isLoginRoute && !request.nextUrl.pathname.startsWith('/api')) {
    response.cookies.set('last_path', request.nextUrl.pathname, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })
  }

  // Allow public routes
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