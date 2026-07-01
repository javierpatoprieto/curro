import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

const RUTAS_PROTEGIDAS = ["/panel"];

/**
 * Refresca la sesión de Supabase en cada request (los tokens caducan) y
 * protege las rutas del panel. Patrón recomendado por @supabase/ssr para el
 * proxy (antes "middleware") de Next.
 *
 * Si Supabase aún no está configurado, no hacemos nada: así `npm run dev`
 * funciona durante el desarrollo temprano sin cuentas reales.
 */
export async function updateSession(request: NextRequest) {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: no metas lógica entre createServerClient y getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const esProtegida = RUTAS_PROTEGIDAS.some((r) => pathname.startsWith(r));

  if (!user && esProtegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
