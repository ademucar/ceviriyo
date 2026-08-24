export type NavItem = { href: string; label: string };
export type NavGroup = { label: string; items: NavItem[] };

export const groups: NavGroup[] = [
  {
    label: "Görsel",
    items: [
      { href: "/", label: "Görsel Dönüştürücü" },
      { href: "/gorsel-kirp", label: "Kırp" },
      { href: "/gorsel-boyutlandir", label: "Boyutlandır" },
      { href: "/gorsel-sikistir", label: "Sıkıştır" },
      { href: "/gorsel-pdf", label: "Görsel → PDF" },
    ],
  },
  {
    label: "PDF",
    items: [
      { href: "/pdf-gorsel", label: "PDF → Görsel" },
      { href: "/pdf-birlestir", label: "PDF Birleştir" },
      { href: "/pdf-sayfa", label: "Sayfa Seç / Sil" },
    ],
  },
];
