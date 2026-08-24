"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "@/app/components/NavLinks";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-3 py-2.5">
        <Link href="/" className="text-sm font-bold text-[var(--fg)]">
          <span className="text-[var(--accent)]">$</span> ceviriyo
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-[var(--line-2)] px-2 py-1 text-xs text-[var(--fg-dim)] active:bg-[var(--panel-2)]"
          aria-label="Menü"
        >
          menu
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/80" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-64 max-w-[82%] flex-col overflow-y-auto border-r border-[var(--line)] bg-[var(--panel)] px-3 py-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs text-[var(--fg-faint)]">~/araclar</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-[var(--line-2)] px-2 py-1 text-xs text-[var(--fg-dim)] active:bg-[var(--panel-2)]"
                aria-label="Kapat"
              >
                esc
              </button>
            </div>

            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />

            <div className="mt-auto border-t border-[var(--line)] pt-3 text-[10px] text-[var(--fg-faint)]">
              <p>
                <Link
                  href="/gizlilik"
                  onClick={() => setOpen(false)}
                  className="hover:text-[var(--fg-dim)]"
                >
                  gizlilik-politikasi
                </Link>
              </p>
              <p className="mt-1">
                <span className="text-[var(--line-2)]">--</span>{" "}
                <a
                  href="https://ademucar.com.tr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--fg-dim)]"
                >
                  adem ucar
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
