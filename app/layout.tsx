import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Barlow } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/components/Sidebar";
import MobileNav from "@/app/components/MobileNav";

// Sıkışık büyük harf başlıklar (saha el kitabı tipografisi)
const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Gövde metni
const text = Barlow({
  variable: "--font-text",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Çeviriyo",
  description: "Hızlı, kolay ve güvenli dönüştürme.",
  // ?v=2 → tarayıcılar favicon'u çok agresif önbelleğe alır; sürüm
  // etiketi olmadan mobilde eski ikon takılı kalıyor.
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e121c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${display.variable} ${text.variable} antialiased`}>
        <div className="flex min-h-dvh">
          <Sidebar />
          <div className="min-w-0 flex-1">
            <MobileNav />
            <main className="px-[clamp(0.75rem,3.5vw,2.5rem)] py-[clamp(1rem,4vh,2.5rem)]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
