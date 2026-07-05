import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarData(data: Date | string): string {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
