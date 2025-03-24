import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const accessToken = request.cookies.get('access_token')?.value

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/register', 
    '/auth/reset-password',
    '/auth/forget-password',
    '/auth/verify-email',
    '/^\/auth\/verify-email\/[^/]+$/',
    /^\/auth\/reset-password\/[^/]+$/ // This pattern matches /auth/reset-password/{token}
  ]
  
  const isPublicRoute = publicRoutes.some(route => {
    if (route instanceof RegExp) {
      return route.test(path)
    }
    return path.startsWith(route)
  })

  // If it's a public route, proceed normally
  if (isPublicRoute) {
    console.log("public route");
    return NextResponse.next()
  }

  // For protected routes, check the token
  if (!accessToken) {
    console.log("no access token");
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // try {
  //   // Make a request to verify the token
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`
  //     }
  //   });

  //   if (response.status === 403) {
  //     // If token is expired/invalid, redirect to reset password
  //     const resetToken = response.headers.get('reset-token');
  //     if (resetToken) {
  //       return NextResponse.redirect(new URL(`/auth/reset-password/${resetToken}`, request.url))
  //     }
  //   }

  //   // If token is valid, proceed
  //   return NextResponse.next()
  // } catch (error) {
  //   // If there's an error, redirect to login
  //   return NextResponse.redirect(new URL('/auth/login', request.url))
  // }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("verify token response======>>>>",response);
  
    const data = await response.json();
    console.log("new token data======>>>>",data);
  
    if (response.ok) {
      // If a new token was issued, update it in cookies
      if (data.newToken) {
        const response = NextResponse.next();
        response.cookies.set('access_token', data.newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 60, // 30 minutes
        });
        return response;
      }
      return NextResponse.next();
    }
  
    // If token is invalid/expired, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Configure which routes should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 