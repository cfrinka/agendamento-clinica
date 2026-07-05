"use client";

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
    <div className="sticky top-0 z-20 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <PageIcon className="w-4 h-4" />
            <span className="font-medium text-foreground">{breadcrumbMap[currentRoute]?.label}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <ChevronRight className="h-3 w-3" />
            {crumbs.map((crumb, index) => (
              <span key={crumb.href} className={cn(index === crumbs.length - 1 && "text-foreground font-medium") }>
                {crumb.label}
                {index < crumbs.length - 1 && <ChevronRight className="ml-2 inline h-3 w-3" />}
              </span>
            ))}
          </div>
        </div>

        {action ? (
          <Button size="lg" render={<Link href={action.href} />}>
            <ActionIcon className="w-4 h-4" />
            {action.label}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { Topbar };
