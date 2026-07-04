"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
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
  id: number;
  nome: string;
  especialidade: string;
  cor: string;
}

interface Agendamento {
  id: number;
  profissionalId: number;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: string;
  profissional: { nome: string; especialidade: string; cor: string };
  paciente: { nome: string; telefone: string | null };
}

interface AgendaCalendarProps {
  profissionais: Profissional[];
  agendamentos: Agendamento[];
}

const HORARIOS = Array.from({ length: 14 }, (_, i) => {
  const hora = i + 7; // 07:00 to 20:00
  return `${hora.toString().padStart(2, "0")}:00`;
});

export function AgendaCalendar({
  profissionais,
  agendamentos,
}: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProfissional, setSelectedProfissional] = useState<
    number | "todos"
  >("todos");
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
  }, [agendamentos, selectedProfissional, weekStart, weekEnd, currentDate, view, profissionais]);

  function getAgendamentosDoDia(dia: Date) {
    return filteredAgendamentos.filter((a) =>
      isSameDay(new Date(a.data), dia)
    );
  }

  function getAgendamentosNoHorario(
    agendamentosDoDia: Agendamento[],
    horario: string
  ) {
    return agendamentosDoDia.filter((a) => a.horaInicio === horario);
  }

  function prevWeek() {
    setCurrentDate(subWeeks(currentDate, 1));
  }

  function nextWeek() {
    setCurrentDate(addWeeks(currentDate, 1));
  }

  function today() {
    setCurrentDate(new Date());
  }

  const weekLabel = `${format(weekStart, "dd/MM", { locale: ptBR })} - ${format(weekEnd, "dd/MM/yyyy", { locale: ptBR })}`;

  return (
    <div className="bg-white rounded-xl border border-border">
      {/* Header controls */}
      <div className="px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={today}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-muted rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hoje
          </button>
          <div className="flex items-center">
            <button
              onClick={prevWeek}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-foreground ml-2">
            {view === "semana"
              ? weekLabel
              : format(currentDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setView("semana")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === "semana"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Semana
            </button>
            <button
              onClick={() => setView("dia")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                view === "dia"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Dia
            </button>
          </div>

          {/* Professional filter */}
          <select
            value={
              selectedProfissional === "todos" ? "todos" : selectedProfissional
            }
            onChange={(e) =>
              setSelectedProfissional(
                e.target.value === "todos" ? "todos" : Number(e.target.value)
              )
            }
            className="px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="todos">Todos os profissionais</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
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
          <div className="sticky top-0 z-10 bg-white border-r border-border">
            <div className="h-16 flex items-center justify-center text-xs font-semibold text-gray-500 uppercase">
              Horário
            </div>
          </div>
          {(view === "semana" ? days : [currentDate]).map((dia) => (
            <div
              key={dia.toISOString()}
              className={cn(
                "sticky top-0 z-10 bg-white border-r border-border p-2 text-center",
                isSameDay(dia, new Date()) && "bg-primary-light"
              )}
            >
              <div className="text-xs text-gray-500">
                {format(dia, "EEE", { locale: ptBR })}
              </div>
              <div
                className={cn(
                  "text-lg font-semibold",
                  isSameDay(dia, new Date())
                    ? "text-primary"
                    : "text-foreground"
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
                className="border-r border-b border-border px-2 py-3 flex items-start justify-center"
              >
                <span className="text-xs text-gray-500 font-medium">
                  {horario}
                </span>
              </div>
              {(view === "semana" ? days : [currentDate]).map((dia) => {
                const agendamentosDoDia = getAgendamentosDoDia(dia);
                const agendamentosNoHorario =
                  getAgendamentosNoHorario(agendamentosDoDia, horario);

                return (
                  <div
                    key={`${dia.toISOString()}-${horario}`}
                    className={cn(
                      "border-r border-b border-border p-1 min-h-[80px]",
                      isSameDay(dia, new Date()) && "bg-blue-50/30"
                    )}
                  >
                    {agendamentosNoHorario.map((ag) => (
                      <div
                        key={ag.id}
                        className="rounded-lg p-2 mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          backgroundColor: ag.profissional.cor + "20",
                          borderLeft: `3px solid ${ag.profissional.cor}`,
                        }}
                      >
                        <div className="text-xs font-medium text-foreground truncate">
                          {ag.paciente.nome}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-[10px] text-gray-500">
                            {ag.horaInicio}
                          </span>
                        </div>
                        <StatusBadge
                          status={ag.status}
                          className="mt-1 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
