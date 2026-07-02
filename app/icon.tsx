import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon generado: monograma "c" sobre coral de marca.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff6b4a",
          color: "#ffffff",
          fontSize: 24,
          fontWeight: 800,
          borderRadius: 7,
        }}
      >
        c
      </div>
    ),
    { ...size },
  );
}
