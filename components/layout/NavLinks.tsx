"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/rate", label: "Rate a Road" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
