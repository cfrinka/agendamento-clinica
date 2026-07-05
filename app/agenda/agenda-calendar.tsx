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
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <span className="text-sm font-semibold ml-1">
            {view === "semana"
              ? weekLabel
              : format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-muted rounded-lg p-0.5">
            <Button
              variant={view === "semana" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("semana")}
              className="h-7 px-2.5 text-xs"
            >
              Semana
            </Button>
            <Button
              variant={view === "dia" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("dia")}
              className="h-7 px-2.5 text-xs"
            >
              Dia
            </Button>
          </div>

          <Select
            value={selectedProfissional === "todos" ? "todos" : String(selectedProfissional)}
            onValueChange={(v) =>
              setSelectedProfissional(v === "todos" ? "todos" : Number(v))
            }
          >
            <SelectTrigger className="h-8 w-48 text-xs">
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

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div
          className="grid min-w-[800px]"
          style={{
            gridTemplateColumns: `80px repeat(${view === "semana" ? days.length : 1}, 1fr)`,
          }}
        >
          {/* Header row */}
          <div className="sticky top-0 z-10 bg-card border-r border-b">
            <div className="h-14 flex items-center justify-center text-xs font-semibold text-muted-foreground uppercase">
              Horário
            </div>
          </div>
          {(view === "semana" ? days : [currentDate]).map((dia) => (
            <div
              key={dia.toISOString()}
              className={cn(
                "sticky top-0 z-10 bg-card border-r border-b p-2 text-center",
                isSameDay(dia, new Date()) && "bg-primary/5"
              )}
            >
              <div className="text-xs text-muted-foreground">
                {format(dia, "EEE", { locale: ptBR })}
              </div>
              <div
                className={cn(
                  "text-lg font-semibold",
                  isSameDay(dia, new Date()) ? "text-primary" : ""
                )}
              >
                {format(dia, "dd")}
              </div>
            </div>
          ))}

          {/* Time slots */}
          {HORARIOS.map((horario) => (
            <>
              <div
                key={`h-${horario}`}
                className="border-r border-b px-2 py-3 flex items-start justify-center"
              >
                <span className="text-xs text-muted-foreground font-medium">
                  {horario}
                </span>
              </div>
              {(view === "semana" ? days : [currentDate]).map((dia) => {
                const agendamentosDoDia = getAgendamentosDoDia(dia);
                const agendamentosNoHorario = agendamentosDoDia.filter(
                  (a) => a.horaInicio === horario
                );

                return (
                  <div
                    key={`${dia.toISOString()}-${horario}`}
                    className={cn(
                      "border-r border-b p-1 min-h-[80px]",
                      isSameDay(dia, new Date()) && "bg-blue-50/20"
                    )}
                  >
                    {agendamentosNoHorario.map((ag) => (
                      <div
                        key={ag.id}
                        className="rounded-md p-1.5 mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: ag.profissional.cor + "18",
                          borderLeft: `3px solid ${ag.profissional.cor}`,
                        }}
                      >
                        <div className="text-xs font-medium truncate leading-tight">
                          {ag.paciente.nome}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {ag.horaInicio}
                          </span>
                        </div>
                        <Badge className={cn("mt-1 text-[10px] h-4 px-1.5", statusBadgeVariant(ag.status))}>
                          {ag.status === "agendado" ? "Agendado"
                            : ag.status === "confirmado" ? "Confirmado"
                            : ag.status === "em_andamento" ? "Andamento"
                            : ag.status === "concluido" ? "Concluído"
                            : "Cancelado"}
                        </Badge>
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
