"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Profissional {
  id: number; nome: string; especialidade: string; cor: string;
}

interface Agendamento {
  id: number; profissionalId: number; data: string;
  horaInicio: string; horaFim: string; status: string;
  profissional: { nome: string; especialidade: string; cor: string };
  paciente: { nome: string; telefone: string | null };
}

interface AgendaCalendarProps {
  profissionais: Profissional[];
  agendamentos: Agendamento[];
}

const HORARIOS = Array.from({ length: 14 }, (_, i) => {
  const hora = i + 7;
  return `${hora.toString().padStart(2, "0")}:00`;
});

const statusStyle = (status: string) => {
  const map: Record<string, string> = {
    agendado: "bg-indigo-50 text-indigo-600 border-indigo-200/50",
    confirmado: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    em_andamento: "bg-amber-50 text-amber-600 border-amber-200/50",
    concluido: "bg-slate-50 text-slate-500 border-slate-200/50",
    cancelado: "bg-red-50 text-red-500 border-red-200/50",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border/50";
};

export function AgendaCalendar({ profissionais, agendamentos }: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProfissional, setSelectedProfissional] = useState<number | "todos">("todos");
  const [view, setView] = useState<"semana" | "dia">("semana");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter((a) => {
      if (selectedProfissional !== "todos") {
        if (a.profissionalId !== selectedProfissional) return false;
      }
      if (view === "semana") {
        const dataAg = new Date(a.data);
        return dataAg >= weekStart && dataAg <= weekEnd;
      }
      return isSameDay(new Date(a.data), currentDate);
    });
  }, [agendamentos, selectedProfissional, weekStart, weekEnd, currentDate, view]);

  function getAgendamentosDoDia(dia: Date) {
    return filteredAgendamentos.filter((a) => isSameDay(new Date(a.data), dia));
  }

  const weekLabel = `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(weekEnd, "dd/MM/yyyy", { locale: ptBR })}`;

  return (
    <Card className="border-border/70 overflow-hidden">
      {/* Calendar header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-sm font-medium">
            {view === "semana"
              ? weekLabel
              : format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-md p-0.5 border border-border/30">
            {["semana", "dia"].map((v) => (
              <Button
                key={v}
                variant={view === v ? "default" : "ghost"}
                size="sm"
                onClick={() => setView(v as "semana" | "dia")}
                className="h-7 px-3 text-xs rounded-sm"
              >
                {v === "semana" ? "Semana" : "Dia"}
              </Button>
            ))}
          </div>

          <Select
            value={selectedProfissional === "todos" ? "todos" : String(selectedProfissional)}
            onValueChange={(v) =>
              setSelectedProfissional(v === "todos" ? "todos" : Number(v))
            }
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os profissionais</SelectItem>
              {profissionais.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile view */}
      <div className="space-y-3 p-4 sm:hidden">
        {(view === "semana" ? days : [currentDate]).map((dia) => {
          const apps = getAgendamentosDoDia(dia);
          const isToday = isSameDay(dia, new Date());
          return (
            <div key={dia.toISOString()} className={cn(
              "rounded-xl border overflow-hidden",
              isToday ? "border-indigo-200/50" : "border-border/60"
            )}>
              <div className={cn(
                "flex items-center justify-between px-4 py-2.5 border-b",
                isToday ? "bg-indigo-50/50 border-indigo-100/50" : "bg-muted/30 border-border/40"
              )}>
                <div className="flex items-center gap-2">
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                  <span className={cn("text-sm font-medium", isToday ? "text-indigo-700" : "text-foreground")}>
                    {format(dia, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <span className={cn(
                  "text-xs tabular-nums",
                  apps.length > 0 ? "text-indigo-600 font-medium" : "text-muted-foreground/50"
                )}>
                  {apps.length}
                </span>
              </div>
              <div className="divide-y divide-border/30">
                {apps.length === 0 ? (
                  <p className="px-4 py-6 text-xs text-muted-foreground/50 text-center">
                    Nenhum agendamento
                  </p>
                ) : apps.map((ag) => (
                  <div key={ag.id} className="flex items-start gap-3 px-4 py-3">
                    <div className="w-0.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: ag.profissional.cor, height: "2rem" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{ag.paciente.nome}</span>
                        <span className="text-xs text-muted-foreground/60 tabular-nums whitespace-nowrap">{ag.horaInicio}</span>
                      </div>
                      <p className="text-xs text-muted-foreground/60 mt-0.5">Dr(a). {ag.profissional.nome}</p>
                      <Badge variant="outline" className={cn("mt-1.5 text-[10px] h-5 px-1.5 font-normal", statusStyle(ag.status))}>
                        {ag.status === "agendado" ? "Agendado"
                          : ag.status === "confirmado" ? "Confirmado"
                          : ag.status === "em_andamento" ? "Em andamento"
                          : ag.status === "concluido" ? "Concluído"
                          : "Cancelado"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop calendar grid */}
      <div className="hidden sm:block overflow-x-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `64px repeat(${view === "semana" ? days.length : 1}, minmax(160px, 1fr))`,
          }}
        >
          {/* Column headers */}
          <div className="sticky top-0 z-10 border-r border-b border-border/40 bg-muted/20" />
          {(view === "semana" ? days : [currentDate]).map((dia) => {
            const isToday = isSameDay(dia, new Date());
            return (
              <div
                key={dia.toISOString()}
                className={cn(
                  "sticky top-0 z-10 border-r border-b border-border/40 py-2.5 text-center",
                  isToday ? "bg-indigo-50/40" : "bg-muted/10"
                )}
              >
                <div className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                  {format(dia, "EEE", { locale: ptBR })}
                </div>
                <div className={cn(
                  "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mt-0.5",
                  isToday ? "bg-indigo-500 text-white" : "text-foreground"
                )}>
                  {format(dia, "dd")}
                </div>
              </div>
            );
          })}

          {/* Time slots */}
          {HORARIOS.map((horario) => (
            <>
              <div key={`h-${horario}`} className="border-r border-b border-border/30 p-1.5 flex items-start justify-center bg-muted/5">
                <span className="text-[10px] text-muted-foreground/40 font-medium tabular-nums">{horario}</span>
              </div>
              {(view === "semana" ? days : [currentDate]).map((dia) => {
                const apps = getAgendamentosDoDia(dia).filter((a) => a.horaInicio === horario);
                const isToday = isSameDay(dia, new Date());
                return (
                  <div
                    key={`${dia.toISOString()}-${horario}`}
                    className={cn(
                      "border-r border-b border-border/30 p-1 min-h-[60px] transition-colors",
                      isToday && "bg-indigo-500/[0.02]"
                    )}
                  >
                    {apps.map((ag) => (
                      <div
                        key={ag.id}
                        className="group relative rounded-md px-2 py-1.5 mb-1 cursor-pointer transition-all hover:shadow-sm"
                        style={{ backgroundColor: ag.profissional.cor + "0d" }}
                      >
                        <div className="absolute left-0 top-0.5 bottom-0.5 w-0.5 rounded-full" style={{ backgroundColor: ag.profissional.cor }} />
                        <div className="pl-2">
                          <div className="text-[11px] font-semibold leading-tight truncate text-foreground">
                            {ag.paciente.nome}
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-muted-foreground/50" />
                            <span className="text-[9px] text-muted-foreground/50 tabular-nums">{ag.horaInicio}</span>
                          </div>
                          <span className={cn(
                            "inline-flex mt-0.5 text-[8px] leading-none px-1 py-0.5 rounded-sm font-medium",
                            statusStyle(ag.status)
                          )}>
                            {ag.status === "agendado" ? "Agd"
                              : ag.status === "confirmado" ? "Conf"
                              : ag.status === "em_andamento" ? "And"
                              : ag.status === "concluido" ? "Conc"
                              : "Canc"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </Card>
  );
}
