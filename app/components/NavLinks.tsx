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
    <nav className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col">
          <p className="tag mb-1.5 px-1">{group.label}</p>
          {group.items.map(({ href, label }, i, arr) => {
            const active = pathname === href;
            const branch = i === arr.length - 1 ? "└─" : "├─";
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`px-1 py-1 text-xs transition-colors ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--fg-dim)] hover:text-[var(--fg)]"
                }`}
              >
                <span className="text-[var(--line-2)]">{branch}</span> {label}
                {active && <span className="ml-1 text-[var(--accent)]">*</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
