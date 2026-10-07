import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (pengganti middleware di Next 16) melindungi /admin/*.
 * Hanya cek sesi optimistik dari cookie (bukan DB check, lihat docs
 * authentication#optimistic-checks-with-proxy-optional). Cek keanggotaan
 * di tabel admins dilakukan di layout admin pada render server.
 */
export async function proxy(request: NextRequest) {
  // Env belum diisi: jangan blokir, biarkan halaman menampilkan pesan.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Tulis ulang response agar token refresh sampai ke browser.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  // Penting: panggil getUser() di awal request supaya refresh token
  // ditulis ke response dan sesi tidak hilang antar request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/signup";

  // Belum login: halaman auth boleh lewat, selain /admin/* diarahkan ke login.
  if (!user) {
    if (isAuthPage) return supabaseResponse;
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = "/admin/login";
    redirectTo.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectTo);
  }

  // Sudah login tapi masih di halaman auth: arahkan ke dashboard.
  if (isAuthPage) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/admin";
    dest.search = "";
    return NextResponse.redirect(dest);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
