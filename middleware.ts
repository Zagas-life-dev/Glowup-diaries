import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Check if we're accessing admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) throw error

    if (isAdminRoute && request.nextUrl.pathname !== '/admin/login') {
      // If no session and trying to access admin routes, redirect to login
      if (!session) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Check if user is an admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!adminUser) {
        // If not an admin, redirect to login
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Set admin role in JWT claims
      const {
        data: { session: updatedSession },
      } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      })
    }

    return res
  } catch (error) {
    console.error('Auth error:', error)
    
    // On error in admin routes, redirect to login
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    return res
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
