"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Calendar,
  LayoutDashboard,
  Users,
  Stethoscope,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Pacientes", href: "/pacientes", icon: Users },
  { name: "Profissionais", href: "/profissionais", icon: Stethoscope },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState({ pacientes: 0, profissionais: 0, agendamentosHoje: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [pacientesRes, profissionaisRes, agendamentosRes] = await Promise.all([
          fetch("/api/pacientes"),
          fetch("/api/profissionais"),
          fetch("/api/agendamentos"),
        ]);
        const [pacientes, profissionais, agendamentos] = await Promise.all([
          pacientesRes.json(),
          profissionaisRes.json(),
          agendamentosRes.json(),
        ]);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        const agendamentosHoje = agendamentos.filter((ag: any) => {
          const data = new Date(ag.data);
          return data >= hoje && data < amanha;
        }).length;

        setStats({
          pacientes: pacientes.length,
          profissionais: profissionais.length,
          agendamentosHoje,
        });
      } catch {
        // ignore
      }
    }

    loadStats();
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar/95 text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border/70 shadow-lg backdrop-blur-xl",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-sidebar-border/50 bg-sidebar-primary/5">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sidebar-primary/15 shadow-sm">
          <Clock className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-sidebar-primary-foreground truncate">
              Agenda Clínica
            </span>
            <span className="text-xs text-sidebar-foreground/70 truncate">
              Sistema de agendamento
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary/15 text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? item.name : undefined}
            >
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-2xl transition-colors duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar/20 text-sidebar-foreground group-hover:bg-sidebar-accent/20 group-hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
              </span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-sidebar-foreground/70">
            <span>Resumo</span>
          </div>
          <div className="grid gap-3">
            <div className="rounded-3xl border border-sidebar-border/50 bg-sidebar/80 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-sidebar-foreground/70">
                Pacientes
              </p>
              <p className="mt-3 text-2xl font-semibold text-sidebar-primary-foreground">
                {stats.pacientes}
              </p>
            </div>
            <div className="rounded-3xl border border-sidebar-border/50 bg-sidebar/80 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-sidebar-foreground/70">
                Profissionais
              </p>
              <p className="mt-3 text-2xl font-semibold text-sidebar-primary-foreground">
                {stats.profissionais}
              </p>
            </div>
            <div className="rounded-3xl border border-sidebar-border/50 bg-sidebar/80 p-4">
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-sidebar-foreground/70">
                Hoje
              </p>
              <p className="mt-3 text-2xl font-semibold text-sidebar-primary-foreground">
                {stats.agendamentosHoje}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-sidebar-border/50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full rounded-2xl"
          title={collapsed ? "Expandir" : "Recolher"}
        >
          {collapsed ? "Expandir" : "Recolher"}
        </Button>
      </div>
    </aside>
  );
}
