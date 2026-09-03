import { ImageResponse } from "next/og";

/**
 * Image sociale par défaut, générée en 1200×630.
 *
 * Remplace public/og-image.png, qui faisait 432×578 en portrait alors que les
 * balises annonçaient 1200×630 : les vignettes partagées sur WhatsApp, Facebook
 * et LinkedIn étaient recadrées ou floues.
 */
export const alt = "StopArnaque Bénin — Signaler et vérifier une arnaque";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1120",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#E8112D",
              color: "white",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 34, fontWeight: 700 }}>
            StopArnaque Bénin
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", color: "white", fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
            Signalez et vérifiez les arnaques
          </div>
          <div style={{ display: "flex", color: "#94A3B8", fontSize: 32, lineHeight: 1.4 }}>
            Numéros frauduleux, Mobile Money, phishing, sextorsion
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Accent drapeau béninois */}
          <div style={{ display: "flex", height: 10, width: 220, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ display: "flex", flex: 1, background: "#008751" }} />
            <div style={{ display: "flex", flex: 1, background: "#FCD116" }} />
            <div style={{ display: "flex", flex: 1, background: "#E8112D" }} />
          </div>
          <div style={{ display: "flex", color: "#64748B", fontSize: 28 }}>stopanarque.bj</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
