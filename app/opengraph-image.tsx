import { ImageResponse } from "next/og";
import { site, unwrap } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #1a120e 0%, #111 55%, #3a0a10 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#F5B800", letterSpacing: 4 }}>
          G.T.S. POBĚŽOVICE
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 16, lineHeight: 1.05 }}>
          {unwrap(site.name)}
        </div>
        <div style={{ fontSize: 28, marginTop: 20, maxWidth: 900, color: "#ddd" }}>
          Pronájem minibagru s obsluhou · Domažlicko
        </div>
        <div
          style={{
            marginTop: 40,
            background: "#E1011B",
            color: "white",
            padding: "14px 28px",
            borderRadius: 8,
            fontSize: 24,
            fontWeight: 700,
            alignSelf: "flex-start",
          }}
        >
          Poptat bagr
        </div>
      </div>
    ),
    { ...size },
  );
}
