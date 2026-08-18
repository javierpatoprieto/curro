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
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const STORAGE_KEY = "curro_cookie_consent"; // "granted" | "denied"

// ¿Hay algún tracker que dependa de consentimiento? Si no, no mostramos banner
// (sin analítica/publicidad no hay cookies no esenciales que consentir).
const HAY_TRACKING = Boolean(GA_ID || META_PIXEL_ID || GOOGLE_ADS_ID);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
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

/**
 * Asegura el runtime de gtag (dataLayer + función `gtag`) y carga gtag.js una
 * sola vez. Lo comparten GA4 y Google Ads: si ya está inicializado, no repite el
 * script. `idScript` es el id con el que se pide gtag.js (basta uno; los `config`
 * posteriores registran GA4 y/o Ads sobre el mismo runtime).
 */
function asegurarGtag(idScript: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
  }
  const src = `https://www.googletagmanager.com/gtag/js?id=${idScript}`;
  if (!document.querySelector(`script[src^="https://www.googletagmanager.com/gtag/js"]`)) {
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }
}

function cargarGA() {
  if (!GA_ID || typeof window === "undefined") return;
  // Evita doble-config de GA4 si ya se llamó.
  if (window.gtag && window.dataLayer?.some((e) => Array.isArray(e) && e[0] === "config" && e[1] === GA_ID)) {
    return;
  }
  asegurarGtag(GA_ID);
  window.gtag!("config", GA_ID);
}

/** Forma interna del stub `fbq` que Meta espera antes de que cargue fbevents.js. */
type FbqStub = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: FbqStub;
  loaded: boolean;
  version: string;
};

/**
 * Meta Pixel: inyecta el snippet oficial de fbq una sola vez y hace init +
 * PageView. Solo se llama tras el consentimiento (mismo opt-in que GA4).
 */
function cargarMetaPixel() {
  if (!META_PIXEL_ID || typeof window === "undefined" || window.fbq) return;
  const fbq = function (this: unknown, ...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as FbqStub;
  const n = fbq;
  n.queue = [];
  n.loaded = true;
  n.version = "2.0";
  n.push = n;
  window.fbq = n;
  window._fbq = window._fbq || n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", META_PIXEL_ID);
  n("track", "PageView");
}

/**
 * Google Ads: reutiliza el runtime de gtag (cargando gtag.js si GA4 no lo hizo)
 * y registra la cuenta de conversión (AW-XXXX). Solo tras el consentimiento.
 */
function cargarGoogleAds() {
  if (!GOOGLE_ADS_ID || typeof window === "undefined") return;
  if (window.gtag && window.dataLayer?.some((e) => Array.isArray(e) && e[0] === "config" && e[1] === GOOGLE_ADS_ID)) {
    return;
  }
  asegurarGtag(GOOGLE_ADS_ID);
  window.gtag!("config", GOOGLE_ADS_ID);
}

/** Carga TODO el tracking consentido (analítica + publicidad). */
function cargarTracking() {
  cargarGA();
  cargarMetaPixel();
  cargarGoogleAds();
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (!HAY_TRACKING) return;
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado === "granted") cargarTracking();
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
    cargarTracking();
    setVisible(false);
  }, []);

  const rechazar = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "denied");
    borrarCookiesGA();
    setVisible(false);
  }, []);

  if (!HAY_TRACKING || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-cream/10 bg-ink p-5 text-cream shadow-2xl sm:flex-row sm:items-center">
        <p className="text-sm leading-relaxed text-cream/80">
          Usamos cookies propias (esenciales) y de análisis y publicidad (Google
          y Meta) para entender cómo se usa la web y medir campañas. Puedes
          aceptarlas o rechazarlas. Más información en{" "}
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
