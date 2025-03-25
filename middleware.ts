import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Get both tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/register', 
    '/auth/reset-password',
    '/auth/forget-password',
    '/auth/verify-email',
    '/auth/verify-token',
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

  // If both tokens are missing, redirect to login
  if (!accessToken && !refreshToken) {
    console.log("no tokens available");
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    // Use whichever token is available (prefer access token)
    const tokenToUse = accessToken || refreshToken;
    console.log('Attempting to verify/refresh token');
    
    const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`, {
      headers: {
        'Authorization': `Bearer ${tokenToUse}`
      }
    });

    console.log('Verify response status:', verifyResponse.status);
    const responseData = await verifyResponse.json();
    console.log('Verify response data:', responseData);

    if (verifyResponse.ok && responseData.valid) {
      const response = NextResponse.next();
      
      // If we got new tokens, update the cookies
      if (responseData.newToken) {
        console.log('Setting new access token from newToken');
        response.cookies.set('access_token', responseData.newToken, {
          maxAge: 30 * 60, // 30 minutes
          path: '/'
        });
      } else if (!accessToken && responseData.valid && tokenToUse) {
        // Add type check for tokenToUse
        console.log('Setting access token from refresh token');
        response.cookies.set('access_token', tokenToUse, {
          maxAge: 30 * 60, // 30 minutes
          path: '/'
        });
      }
      
      if (responseData.newRefreshToken) {
        console.log('Setting new refresh token');
        response.cookies.set('refresh_token', responseData.newRefreshToken, {
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/'
        });
      }
      
      return response;
    }

    if (verifyResponse.status === 403) {
      // Handle unverified user
      try {
        const verifyEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-verification-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenToUse}`
          }
        });
        
        if (verifyEmailResponse.ok) {
          const data = await verifyEmailResponse.json();
          return NextResponse.redirect(new URL(data.verificationPageUrl, request.url));
        }
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }
    }

    // If verification failed completely
    console.log('Token verification failed');
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
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