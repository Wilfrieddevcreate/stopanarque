import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { stripHtml } from "@/lib/content";
import { truncate } from "@/lib/seo";

/**
 * Image sociale propre à chaque article.
 *
 * Les articles partageaient tous la même vignette générique : sur WhatsApp,
 * canal d'acquisition principal, six liens différents s'affichaient à l'identique.
 */
export const alt = "Article StopArnaque Bénin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ArticleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const title = article ? truncate(stripHtml(article.title), 95) : "StopArnaque Bénin";
  const category = article?.category ?? "Alerte";

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
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#E8112D",
              color: "white",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 30, fontWeight: 700 }}>
            StopArnaque Bénin
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 12,
              padding: "8px 20px",
              borderRadius: 999,
              background: "rgba(232,17,45,0.18)",
              color: "#FF8A9B",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "white",
            fontSize: title.length > 60 ? 52 : 62,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", height: 10, width: 220, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ display: "flex", flex: 1, background: "#008751" }} />
            <div style={{ display: "flex", flex: 1, background: "#FCD116" }} />
            <div style={{ display: "flex", flex: 1, background: "#E8112D" }} />
          </div>
          <div style={{ display: "flex", color: "#64748B", fontSize: 26 }}>stopanarque.bj</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
