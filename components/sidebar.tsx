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
        "flex flex-col h-full bg-sidebar text-sidebar-foreground select-none",
        "transition-all duration-300 ease-out border-r border-sidebar-border",
        collapsed ? "w-[60px]" : "w-56"
      )}
    >
      {/* Brand header */}
      <div className="flex items-center gap-2.5 px-3.5 h-14 shrink-0 border-b border-sidebar-border/50">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary shadow-sm">
          <Clock className="w-[18px] h-[18px] text-white" />
        </div>
        {!collapsed && (
          <span className="text-[13px] font-semibold text-white tracking-tight truncate">
            Agenda Clínica
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
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
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              title={collapsed ? item.name : undefined}
            >
              <span className="grid w-5 h-5 shrink-0 place-items-center">
                <item.icon className={cn(
                  "w-[18px] h-[18px] transition-colors",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
                )} />
              </span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Stats section */}
      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="h-px bg-sidebar-border/40 mb-3" />
          <div className="grid gap-1.5">
            {[
              { label: "Pacientes", value: stats.pacientes, icon: Users },
              { label: "Profissionais", value: stats.profissionais, icon: Stethoscope },
              { label: "Consultas hoje", value: stats.agendamentosHoje, icon: Calendar },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-sidebar-accent/30"
              >
                <span className="text-[11px] text-sidebar-foreground/50">{item.label}</span>
                <span className="text-xs font-semibold text-sidebar-foreground tabular-nums">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="px-2 py-2 border-t border-sidebar-border/40">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-8 rounded-lg text-sidebar-foreground/30 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150"
          title={collapsed ? "Expandir" : "Recolher"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Recolher</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
