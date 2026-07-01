import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Este proyecto vive dentro de un repo mayor (javierpato.es) que tiene su
  // propio lockfile y su propio proxy.ts. Fijamos la raíz a esta carpeta para
  // que Turbopack no "suba" e intente compilar el proyecto de al lado.
  turbopack: { root: import.meta.dirname },

  // Fallamos el build si hay errores de tipos: preferimos romper en CI antes
  // que desplegar un panel con fugas entre tenants.
  // (En Next 16 `next build` ya no ejecuta el linter; se corre con `npm run lint`.)
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
