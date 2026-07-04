import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarData(data: Date | string): string {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatarHora(hora: string): string {
  return hora;
}

export function formatarDataHora(data: Date | string): string {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function obterDiaSemana(dia: number): string {
  const dias = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  return dias[dia];
}

export function obterDiaSemanaAbreviado(dia: number): string {
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return dias[dia];
}

export function statusAgendamento(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    agendado: { label: "Agendado", color: "bg-blue-100 text-blue-800" },
    confirmado: { label: "Confirmado", color: "bg-green-100 text-green-800" },
    em_andamento: {
      label: "Em Andamento",
      color: "bg-yellow-100 text-yellow-800",
    },
    concluido: { label: "Concluído", color: "bg-gray-100 text-gray-800" },
    cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  };
  return statusMap[status] ?? { label: status, color: "bg-gray-100 text-gray-800" };
}
