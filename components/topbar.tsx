"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Users, LayoutDashboard, Calendar, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

const breadcrumbMap: Record<string, { label: string; href: string }> = {
  "/": { label: "Dashboard", href: "/" },
  "/agenda": { label: "Agenda", href: "/agenda" },
  "/pacientes": { label: "Pacientes", href: "/pacientes" },
  "/profissionais": { label: "Profissionais", href: "/profissionais" },
};

const actionMap: Record<string, { label: string; href: string; icon: React.ComponentType<any> }> = {
  "/": { label: "Novo Agendamento", href: "/agenda/novo", icon: Plus },
  "/agenda": { label: "Novo Agendamento", href: "/agenda/novo", icon: Plus },
  "/pacientes": { label: "Novo Paciente", href: "/pacientes/novo", icon: Users },
  "/profissionais": { label: "Novo Profissional", href: "/profissionais/novo", icon: Stethoscope },
};

const iconMap: Record<string, React.ComponentType<any>> = {
  "/": LayoutDashboard,
  "/agenda": Calendar,
  "/pacientes": Users,
  "/profissionais": Stethoscope,
};

function Topbar() {
  const pathname = usePathname();
  const currentRoute = Object.keys(breadcrumbMap).find((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  ) || "/";

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, all) => {
      const path = `/${all.slice(0, index + 1).join("/")}`;
      return {
        label: breadcrumbMap[path]?.label ?? segment,
        href: path,
      };
    });

  const ActionIcon = actionMap[currentRoute]?.icon ?? Plus;
  const action = actionMap[currentRoute];
  const PageIcon = iconMap[currentRoute] ?? LayoutDashboard;

  return (
    <div className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-2xl supports-backdrop-blur:bg-background/60 [&:not(:has(~*))]:border-transparent">
      <div className="mx-auto flex flex-col gap-3 px-0 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary">
              <PageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{breadcrumbMap[currentRoute]?.label}</h2>
          </div>
          {crumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 pl-[42px]">
              <Link href="/" className="transition-colors hover:text-foreground">
                Dashboard
              </Link>
              {crumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                  <span className={cn(index === crumbs.length - 1 && "text-foreground/80 font-medium")}>
                    {crumb.label}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {action ? (
          <Button render={<Link href={action.href} />} className="shadow-sm shadow-primary/10">
            <ActionIcon className="w-4 h-4" />
            {action.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { Topbar };
