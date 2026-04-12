import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  let userRole = null;
  if (user) {
      // Using generic type casting to prevent TS errors if user_roles doesn't exist locally yet
      const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
      userRole = roleData?.role;
  }

  // 1. Admin & Manager Route Protection
  if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
      if (!user) {
          url.pathname = '/admin/login'
          return NextResponse.redirect(url)
      }

      if (userRole !== 'admin' && userRole !== 'manager') {
          // Fallback check just in case DB is offline/unseeded
          const isAdminEmail = user.email?.toLowerCase().includes('admin');
          if (!isAdminEmail) {
               url.pathname = '/';
               return NextResponse.redirect(url);
          }
      }

      // If they are a manager and they hit the raw /admin root, immediately bounce to their hub
      if (userRole === 'manager' && url.pathname === '/admin') {
          url.pathname = '/admin/manager';
          return NextResponse.redirect(url);
      }

      // Strict CMS barrier: Managers cannot visit customize or services admin screens
      if (userRole === 'manager' && (url.pathname.startsWith('/admin/customize') || url.pathname.startsWith('/admin/services'))) {
          url.pathname = '/admin/manager';
          return NextResponse.redirect(url);
      }
  }

  // 2. Frontend Dashboard Route Protection
  if (url.pathname.startsWith('/dashboard')) {
      if (!user) {
          url.pathname = '/auth/login'
          return NextResponse.redirect(url)
      }

      // If user tries to access just /dashboard, redirect them to their specific role dashboard
      if (url.pathname === '/dashboard') {
          if (userRole === 'admin' || userRole === 'manager') {
              url.pathname = '/admin';
          } else if (userRole) {
              url.pathname = `/dashboard/${userRole}`;
          } else {
              url.pathname = '/'; // Unknown role
          }
          return NextResponse.redirect(url);
      }

      // Block cross-role access (e.g. Customer trying to view /dashboard/doctor)
      // Only check the first segment after /dashboard/ — e.g. 'caregiver' in /dashboard/caregiver/task/123
      const pathSegments = url.pathname.split('/');
      const expectedRoleDir = pathSegments[2]; // e.g. 'caregiver' from '/dashboard/caregiver/task/123'

      // Only block if the segment is a known role (not a sub-page like 'task')
      const KNOWN_ROLES = ['caregiver', 'doctor', 'partner', 'customer', 'admin', 'manager'];
      if (expectedRoleDir && KNOWN_ROLES.includes(expectedRoleDir) && userRole && expectedRoleDir !== userRole) {
          url.pathname = `/dashboard/${userRole}`;
          return NextResponse.redirect(url);
      }
  }

  return supabaseResponse
}
