"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Consentimiento de cookies con BLOQUEO PREVIO de Google Analytics 4.
 *
 * GA4 usa cookies no esenciales, así que solo se carga tras aceptar (opt-in).
 * Si el visitante rechaza, no se inyecta nada. La decisión se guarda en
 * localStorage (preferencia técnica, exenta) y puede cambiarse con el enlace
 * "Gestionar cookies" (dispara el evento `curro:open-cookie-consent`).
 *
 * El banner solo aparece si hay un ID de GA configurado (NEXT_PUBLIC_GA_ID);
 * sin analítica no hay cookies no esenciales y no hace falta pedir consentimiento.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const STORAGE_KEY = "curro_cookie_consent"; // "granted" | "denied"

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function borrarCookiesGA() {
  const dominios = [location.hostname, "." + location.hostname, ""];
  document.cookie.split(";").forEach((c) => {
    const nombre = c.split("=")[0].trim();
    if (nombre.startsWith("_ga") || nombre === "_gid") {
      dominios.forEach((d) => {
        document.cookie =
          `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
          (d ? `; domain=${d}` : "");
      });
    }
  });
}

function cargarGA() {
  if (!GA_ID || typeof window === "undefined" || window.gtag) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (!GA_ID) return;
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado === "granted") cargarGA();
    // Decisión client-only al montar (depende de localStorage, no disponible en SSR).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (guardado !== "denied") setVisible(true);

    const abrir = () => setVisible(true);
    window.addEventListener("curro:open-cookie-consent", abrir);
    return () => window.removeEventListener("curro:open-cookie-consent", abrir);
  }, []);

  // page_view en cada cambio de ruta (SPA), solo si hay consentimiento.
  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return; // el page_view inicial ya lo envía config()
    }
    if (
      GA_ID &&
      window.gtag &&
      localStorage.getItem(STORAGE_KEY) === "granted"
    ) {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname]);

  const aceptar = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "granted");
    cargarGA();
    setVisible(false);
  }, []);

  const rechazar = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "denied");
    borrarCookiesGA();
    setVisible(false);
  }, []);

  if (!GA_ID || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-cream/10 bg-ink p-5 text-cream shadow-2xl sm:flex-row sm:items-center">
        <p className="text-sm leading-relaxed text-cream/80">
          Usamos cookies propias (esenciales) y de análisis (Google Analytics)
          para entender cómo se usa la web. Puedes aceptarlas o rechazarlas. Más
          información en{" "}
          <a href="/cookies" className="font-semibold text-cream underline">
            política de cookies
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={rechazar}
            className="rounded-full border border-cream/25 px-4 py-2 text-sm font-semibold transition-colors hover:bg-cream/10"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={aceptar}
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
