import { ImageResponse } from "next/og";

export const alt = "Curro — Recepcionista con IA para reformas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen que aparece al compartir el enlace en redes/mensajería.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#06232b",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#8fb3ad",
            fontSize: "26px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Recepcionista con IA · 24/7 · en español
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "86px",
              fontWeight: 800,
              color: "#f3fbfb",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            Curro coge el teléfono
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "86px",
              fontWeight: 800,
              color: "#ff6b4a",
              lineHeight: 1.05,
              letterSpacing: "-2px",
            }}
          >
            cuando tú no puedes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                width: "48px",
                height: "48px",
                borderRadius: "999px",
                background: "#ff6b4a",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              c
            </div>
            <div style={{ display: "flex", fontSize: "42px", fontWeight: 800, color: "#f3fbfb" }}>
              curro
            </div>
          </div>
          <div style={{ display: "flex", fontSize: "26px", color: "#8fb3ad" }}>
            para reformas y multiservicios del hogar
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
