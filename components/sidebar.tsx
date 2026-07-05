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
        "flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] border-r border-sidebar-border shadow-2xl",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-[72px] shrink-0 border-b border-sidebar-border/60">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-lg shadow-sidebar-primary/20">
          <Clock className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-sidebar-primary-foreground truncate tracking-tight">
              Agenda Clínica
            </span>
            <span className="text-[11px] text-sidebar-foreground/50 truncate tracking-wide">
              Sistema de agendamento
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
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
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
              )}
              title={collapsed ? item.name : undefined}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-sidebar-primary shadow-lg shadow-sidebar-primary/40" />
              )}
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 text-white shadow-md shadow-sidebar-primary/30"
                    : "bg-sidebar-accent/30 text-sidebar-foreground/60 group-hover:bg-sidebar-accent/50 group-hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
              </span>
              {!collapsed && <span className="tracking-tight">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && stats.pacientes > 0 && (
        <div className="px-4 pb-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40 font-semibold">
              Resumo
            </span>
          </div>
          <div className="grid gap-2">
            <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/20 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
                  Pacientes
                </span>
                <Users className="w-3.5 h-3.5 text-sidebar-foreground/30" />
              </div>
              <p className="mt-1.5 text-xl font-bold tracking-tight text-sidebar-primary-foreground">
                {stats.pacientes}
              </p>
            </div>
            <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/20 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
                  Profissionais
                </span>
                <Stethoscope className="w-3.5 h-3.5 text-sidebar-foreground/30" />
              </div>
              <p className="mt-1.5 text-xl font-bold tracking-tight text-sidebar-primary-foreground">
                {stats.profissionais}
              </p>
            </div>
            <div className="rounded-xl border border-sidebar-border/40 bg-sidebar-accent/20 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
                  Hoje
                </span>
                <Calendar className="w-3.5 h-3.5 text-sidebar-foreground/30" />
              </div>
              <p className="mt-1.5 text-xl font-bold tracking-tight text-sidebar-primary-foreground">
                {stats.agendamentosHoje}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-sidebar-border/40">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-9 rounded-xl text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/40 transition-all duration-200 group"
          title={collapsed ? "Expandir" : "Recolher"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          )}
          {!collapsed && (
            <span className="ml-2 text-xs tracking-wide">Recolher</span>
          )}
        </button>
      </div>
    </aside>
  );
}
