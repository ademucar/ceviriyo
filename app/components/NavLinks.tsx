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
          <div className="flex flex-col">
            {group.items.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`display border-b border-[var(--rule)] px-1 py-1.5 text-[13px] transition-colors last:border-b-0 ${
                    active
                      ? "text-[var(--ink)]"
                      : "text-[var(--ink-dim)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className={active ? "text-[var(--accent)]" : "text-[var(--rule-2)]"}>
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
