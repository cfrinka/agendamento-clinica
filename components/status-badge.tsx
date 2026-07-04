import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  agendado: "bg-blue-100 text-blue-700 border-blue-200",
  confirmado: "bg-emerald-100 text-emerald-700 border-emerald-200",
  em_andamento: "bg-amber-100 text-amber-700 border-amber-200",
  concluido: "bg-gray-100 text-gray-700 border-gray-200",
  cancelado: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  em_andamento: "Em Andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.agendado;
  const label = statusLabels[status] ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
