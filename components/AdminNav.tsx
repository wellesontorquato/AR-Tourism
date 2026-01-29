"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "POIs",
    href: "/admin/pois",
  },
  {
    label: "Novo POI",
    href: "/admin/pois/new",
  },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      // garante redirecionamento mesmo se der erro
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-sky-500/15 text-sky-400"
                : "text-slate-300 hover:bg-slate-800 hover:text-slate-100",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}

      <div className="my-3 h-px bg-slate-800" />

      <button
        onClick={handleLogout}
        className="rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
      >
        Sair
      </button>
    </nav>
  );
}
