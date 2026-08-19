import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login page (no redirect loop)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // /admin/dev-login is kept as a page but no longer grants access
  // Redirect any visit to dev-login to the real login page
  if (pathname === '/admin/dev-login') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // For all other /admin/* routes — verify Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const response = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            sameSite: 'none',
            secure: true,
          });
        });
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Verify the authenticated user exists in admin_users with is_active = true
  const userEmail = session.user.email?.toLowerCase().trim() || '';

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, is_active, role')
    .eq('email', userEmail)
    .eq('is_active', true)
    .maybeSingle();

  if (!adminUser) {
    // User is authenticated but not an admin — redirect to login with error
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('error', 'unauthorized');
    url.searchParams.set('email', userEmail);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
