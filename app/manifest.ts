import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StopArnaque Bénin",
    short_name: "StopArnaque",
    description:
      "Plateforme béninoise de signalement d'arnaques téléphoniques et en ligne.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#E8112D",
    orientation: "portrait-primary",
    categories: ["utilities", "security"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
