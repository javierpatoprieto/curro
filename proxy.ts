import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// En Next 16, "middleware" pasa a llamarse "proxy". Un solo fichero por proyecto.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Todo menos estáticos e imágenes; así refrescamos la sesión en las páginas.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
