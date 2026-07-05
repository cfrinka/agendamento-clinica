"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Filter } from "lucide-react";
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

const statusBadgeVariant = (status: string) => {
  const map: Record<string, string> = {
    agendado: "bg-primary/10 text-primary hover:bg-primary/15",
    confirmado: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    em_andamento: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    concluido: "bg-muted text-muted-foreground hover:bg-muted",
    cancelado: "bg-red-100 text-red-700 hover:bg-red-100",
  };
  return map[status] ?? "";
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
    <Card className="overflow-hidden border border-border/60 shadow-sm rounded-2xl">
      {/* Premium Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-border/50 bg-gradient-to-r from-muted/50 to-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="h-8 px-3 text-xs font-medium rounded-lg"
            >
              Hoje
            </Button>
            <div className="flex items-center ml-1">
              <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {view === "semana"
              ? weekLabel
              : format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-muted/80 rounded-lg p-0.5 ring-1 ring-border/30">
            <Button
              variant={view === "semana" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("semana")}
              className="h-7 px-3 text-xs font-medium rounded-md"
            >
              Semana
            </Button>
            <Button
              variant={view === "dia" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("dia")}
              className="h-7 px-3 text-xs font-medium rounded-md"
            >
              Dia
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground/50" />
            <Select
              value={selectedProfissional === "todos" ? "todos" : String(selectedProfissional)}
              onValueChange={(v) =>
                setSelectedProfissional(v === "todos" ? "todos" : Number(v))
              }
            >
              <SelectTrigger className="h-8 w-44 text-xs rounded-lg">
                <SelectValue placeholder="Todos os profissionais" />
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
      </div>

      {/* Mobile schedule list */}
      <div className="space-y-4 p-4 sm:hidden">
        {(view === "semana" ? days : [currentDate]).map((dia) => {
          const agendamentosDoDia = getAgendamentosDoDia(dia);
          const isToday = isSameDay(dia, new Date());
          return (
            <div
              key={dia.toISOString()}
              className={cn(
                "rounded-xl border bg-card overflow-hidden transition-all",
                isToday ? "border-primary/20 ring-1 ring-primary/5" : "border-border/60"
              )}
            >
              <div className={cn(
                "flex items-center justify-between gap-4 px-4 py-3 border-b",
                isToday ? "bg-primary/5 border-primary/10" : "bg-muted/30 border-border/40"
              )}>
                <div className="flex items-center gap-2">
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground/70">
                      {format(dia, "EEEE", { locale: ptBR })}
                    </p>
                    <p className={cn("text-base font-semibold", isToday ? "text-primary" : "text-foreground")}>
                      {format(dia, "dd 'de' MMMM")}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-medium",
                  agendamentosDoDia.length > 0
                    ? "bg-primary/8 text-primary"
                    : "bg-muted/50 text-muted-foreground/50"
                )}>
                  {agendamentosDoDia.length} consulta{agendamentosDoDia.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="divide-y divide-border/30">
                {agendamentosDoDia.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground/50">Nenhum agendamento neste dia.</p>
                  </div>
                ) : (
                  agendamentosDoDia.map((ag) => (
                    <div
                      key={ag.id}
                      className="px-4 py-3 transition-colors hover:bg-muted/20 active:bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-1 rounded-full shrink-0 mt-1"
                          style={{
                            backgroundColor: ag.profissional.cor,
                            height: '2.5rem',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {ag.paciente.nome}
                            </p>
                            <span className="text-xs text-muted-foreground/60 whitespace-nowrap tabular-nums">
                              {ag.horaInicio}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">
                            Dr(a). {ag.profissional.nome}
                          </p>
                          <Badge className={cn("mt-1.5 inline-flex text-[10px] h-5 px-2 font-medium", statusBadgeVariant(ag.status))}>
                            {ag.status === "agendado" ? "Agendado"
                              : ag.status === "confirmado" ? "Confirmado"
                              : ag.status === "em_andamento" ? "Em andamento"
                              : ag.status === "concluido" ? "Concluído"
                              : "Cancelado"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar grid */}
      <div className="hidden sm:block overflow-x-auto">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `72px repeat(${view === "semana" ? days.length : 1}, minmax(180px, 1fr))`,
          }}
        >
          {/* Header row */}
          <div className="sticky top-0 z-10 bg-muted/30 border-r border-b border-border/40">
            <div className="h-12 flex items-center justify-center text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
              Horário
            </div>
          </div>
          {(view === "semana" ? days : [currentDate]).map((dia) => {
            const isToday = isSameDay(dia, new Date());
            return (
              <div
                key={dia.toISOString()}
                className={cn(
                  "sticky top-0 z-10 border-r border-b border-border/40 p-2 text-center",
                  isToday ? "bg-primary/5" : "bg-muted/20"
                )}
              >
                <div className="text-[11px] text-muted-foreground/60 font-medium">
                  {format(dia, "EEE", { locale: ptBR })}
                </div>
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-semibold mt-0.5",
                    isToday ? "bg-primary text-white shadow-sm shadow-primary/30" : "text-foreground"
                  )}
                >
                  {format(dia, "dd")}
                </div>
              </div>
            );
          })}

          {/* Time slots */}
          {HORARIOS.map((horario) => (
            <>
              <div
                key={`h-${horario}`}
                className="border-r border-b border-border/30 p-1.5 flex items-start justify-center bg-muted/10"
              >
                <span className="text-[11px] text-muted-foreground/50 font-medium tabular-nums">
                  {horario}
                </span>
              </div>
              {(view === "semana" ? days : [currentDate]).map((dia) => {
                const agendamentosDoDia = getAgendamentosDoDia(dia);
                const agendamentosNoHorario = agendamentosDoDia.filter(
                  (a) => a.horaInicio === horario
                );
                const isToday = isSameDay(dia, new Date());

                return (
                  <div
                    key={`${dia.toISOString()}-${horario}`}
                    className={cn(
                      "border-r border-b border-border/30 p-1.5 min-h-[72px] transition-colors",
                      isToday && "bg-primary/[0.02]"
                    )}
                  >
                    {agendamentosNoHorario.map((ag) => (
                      <div
                        key={ag.id}
                        className="group relative rounded-lg p-2 mb-1.5 cursor-pointer transition-all duration-150 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                          backgroundColor: ag.profissional.cor + "10",
                        }}
                      >
                        {/* Color accent bar */}
                        <div
                          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                          style={{ backgroundColor: ag.profissional.cor }}
                        />
                        <div className="pl-2.5">
                          <div className="text-xs font-semibold truncate leading-tight text-foreground">
                            {ag.paciente.nome}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                              {ag.horaInicio}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={cn(
                                "inline-flex text-[9px] leading-none px-1.5 py-0.5 rounded-full font-medium",
                                statusBadgeVariant(ag.status)
                              )}
                            >
                              {ag.status === "agendado" ? "Agendado"
                                : ag.status === "confirmado" ? "Confirmado"
                                : ag.status === "em_andamento" ? "Em andamento"
                                : ag.status === "concluido" ? "Concluído"
                                : "Cancelado"}
                            </span>
                          </div>
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
