"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLinks from "@/app/components/NavLinks";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--panel)] px-3 py-5 md:flex">
      <Link href="/" className="mb-6 block px-1">
        <span className="block text-sm font-bold tracking-tight text-[var(--fg)]">
          <span className="text-[var(--accent)]">$</span> ceviriyo
        </span>
        <span className="mt-0.5 block text-[10px] text-[var(--fg-faint)]">
          pdf &amp; gorsel araclari
        </span>
      </Link>

      <NavLinks pathname={pathname} />

      <div className="mt-auto border-t border-[var(--line)] pt-3 text-[10px] text-[var(--fg-faint)]">
        <p>
          <Link href="/gizlilik" className="hover:text-[var(--fg-dim)]">
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
    </aside>
  );
}
