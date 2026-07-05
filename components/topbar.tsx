"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Users, Stethoscope } from "lucide-react";

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/agenda": "Agenda",
  "/agenda/novo": "Novo Agendamento",
  "/pacientes": "Pacientes",
  "/pacientes/novo": "Novo Paciente",
  "/profissionais": "Profissionais",
  "/profissionais/novo": "Novo Profissional",
};

const actionMap: Record<string, { label: string; href: string; icon: React.ComponentType<any> }> = {
  "/": { label: "Novo Agendamento", href: "/agenda/novo", icon: Plus },
  "/agenda": { label: "Novo Agendamento", href: "/agenda/novo", icon: Plus },
  "/pacientes": { label: "Novo Paciente", href: "/pacientes/novo", icon: Users },
  "/profissionais": { label: "Novo Profissional", href: "/profissionais/novo", icon: Stethoscope },
};

function Topbar() {
  const pathname = usePathname();
  const currentRoute = "/" + (pathname.split("/")[1] || "");
  const action = actionMap[currentRoute] ?? null;
  const ActionIcon = action?.icon ?? Plus;

  const title = breadcrumbMap[pathname] ?? breadcrumbMap[currentRoute] ?? "";

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>
      {action && (
        <Button render={<Link href={action.href} />}>
          <ActionIcon className="w-4 h-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { Topbar };
