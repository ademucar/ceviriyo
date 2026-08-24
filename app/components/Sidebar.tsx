"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "@/app/components/NavLinks";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-y-auto border-r border-[var(--rule)] bg-[var(--paper-2)] px-4 py-6 md:flex">
      <Link href="/" className="flex items-center justify-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.png" alt="" width={46} height={46} className="shrink-0" />
        <span className="display text-xl tracking-[0.2em]">Çeviriyo</span>
      </Link>

      <div className="ornament my-5">
        <span aria-hidden="true">&#9670;</span>
      </div>

      <NavLinks pathname={pathname} />

      <div className="mt-auto pt-5 text-center">
        <div className="ornament mb-3">
          <span aria-hidden="true">&#9670;</span>
        </div>
        <p>
          <Link href="/gizlilik" className="foot-link text-[12px]">
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
    </aside>
  );
}
