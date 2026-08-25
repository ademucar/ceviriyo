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
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--rule)] bg-[var(--paper-2)] px-3 py-2.5">
        <Link href="/" className="tap display flex items-center gap-2 text-lg tracking-[0.18em]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" width={45} height={35} className="shrink-0" />
          Çeviriyo
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="tap btn-3d label border border-[var(--rule-2)] bg-[var(--paper-3)] px-3 text-[var(--ink)]"
          aria-label="Menü"
        >
          Menü
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-64 max-w-[82%] flex-col overflow-y-auto border-r border-[var(--rule)] bg-[var(--paper-2)] px-4 py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="display flex items-center gap-2 text-base tracking-[0.18em]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-mark.png" alt="" width={38} height={30} className="shrink-0" />
                Çeviriyo
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="tap btn-3d label border border-[var(--rule-2)] bg-[var(--paper-3)] px-3 text-[var(--ink)]"
                aria-label="Kapat"
              >
                Kapat
              </button>
            </div>

            <div className="ornament mb-5">
              <span aria-hidden="true">&#9670;</span>
            </div>

            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />

            <div className="mt-auto pt-5 text-center">
              <div className="ornament mb-3">
                <span aria-hidden="true">&#9670;</span>
              </div>
              <p>
                <Link
                  href="/gizlilik"
                  onClick={() => setOpen(false)}
                  className="foot-link text-[12px]"
                >
                  Gizlilik Politikası
                </Link>
              </p>
              <p className="mt-2">
                <a
                  href="https://ademucar.com.tr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="foot-link text-[12px]"
                >
                  Adem Uçar
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
