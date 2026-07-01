"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ENLACES = [
  { href: "/panel", label: "Resumen", icon: LayoutDashboard, exact: true },
  { href: "/panel/leads", label: "Leads", icon: Inbox, exact: false },
  { href: "/panel/uso", label: "Uso", icon: BarChart3, exact: false },
  { href: "/panel/ajustes", label: "Ajustes", icon: Settings, exact: false },
];

export function PanelNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {ENLACES.map(({ href, label, icon: Icon, exact }) => {
        const activo = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activo
                ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
