"use client";

/** Reabre el banner de consentimiento para cambiar la decisión de cookies. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.dispatchEvent(new Event("curro:open-cookie-consent"))
      }
      className="font-semibold text-[var(--foreground)] underline underline-offset-2"
    >
      Gestionar cookies
    </button>
  );
}
