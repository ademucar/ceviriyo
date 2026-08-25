import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Çeviriyo",
    short_name: "Çeviriyo",
    description: "Hızlı, kolay ve güvenli dönüştürme.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e121c",
    theme_color: "#0e121c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
