"use client";
import Link from "next/link";
import { groups } from "@/app/lib/nav";

export default function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="band mb-2">{group.label}</p>
          <div className="flex flex-col gap-2.5">
            {group.items.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`nav-item display py-2 pr-2 text-[13px] ${
                    active ? "text-[var(--ink)]" : "text-[var(--ink-2)]"
                  }`}
                >
                  <span className="gem" aria-hidden="true">
                    &#9670;
                  </span>{" "}
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
