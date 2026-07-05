import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Stethoscope,
  Users,
  Clock,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatarData, statusAgendamento } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const [totalPacientes, totalProfissionais, agendamentosHoje] =
    await Promise.all([
      prisma.paciente.count(),
      prisma.profissional.count({ where: { ativo: true } }),
      prisma.agendamento.findMany({
        where: {
          data: { gte: hoje, lt: amanha },
        },
        include: {
          profissional: { select: { nome: true, especialidade: true, cor: true } },
          paciente: { select: { nome: true } },
        },
        orderBy: { horaInicio: "asc" },
      }),
    ]);

  return { totalPacientes, totalProfissionais, agendamentosHoje };
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card className="border-border/70">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: color + "15", color: color }}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground/70 mb-0.5">{label}</p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground/50 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default async function Dashboard() {
  const { totalPacientes, totalProfissionais, agendamentosHoje } =
    await getDashboardData();

  const statusCounts = agendamentosHoje.reduce(
    (acc, ag) => {
      acc[ag.status] = (acc[ag.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusConfig: Record<string, { label: string; color: string; bar: string }> = {
    confirmado: { label: "Confirmado", color: "#10b981", bar: "bg-emerald-500" },
    agendado: { label: "Agendado", color: "#6366f1", bar: "bg-indigo-500" },
    em_andamento: { label: "Em andamento", color: "#f59e0b", bar: "bg-amber-500" },
    concluido: { label: "Concluído", color: "#64748b", bar: "bg-slate-500" },
    cancelado: { label: "Cancelado", color: "#ef4444", bar: "bg-red-500" },
  };

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={CalendarDays}
          label="Consultas hoje"
          value={agendamentosHoje.length}
          sub="Agendadas para hoje"
          color="#6366f1"
        />
        <StatCard
          icon={Users}
          label="Total de pacientes"
          value={totalPacientes}
          sub="Cadastrados na clínica"
          color="#10b981"
        />
        <StatCard
          icon={Stethoscope}
          label="Profissionais"
          value={totalProfissionais}
          sub="Ativos na clínica"
          color="#8b5cf6"
        />
        <StatCard
          icon={Clock}
          label="Próxima consulta"
          value={agendamentosHoje.length > 0 ? agendamentosHoje[0].horaInicio : "---"}
          sub={agendamentosHoje.length > 0 ? agendamentosHoje[0].paciente.nome : "Nenhuma hoje"}
          color="#f59e0b"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Status distribution */}
        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="px-5 pt-5 pb-3">
            <CardTitle className="text-sm font-semibold">Status das consultas</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = statusCounts[key] ?? 0;
              const pct = agendamentosHoje.length
                ? Math.round((count / agendamentosHoje.length) * 100)
                : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-muted-foreground">{cfg.label}</span>
                    </div>
                    <span className="font-medium text-foreground tabular-nums">
                      {count}
                      <span className="text-muted-foreground/50 ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${cfg.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {agendamentosHoje.length === 0 && (
              <p className="text-xs text-muted-foreground/50 text-center py-3">
                Nenhum agendamento hoje
              </p>
            )}
          </CardContent>
        </Card>

        {/* Today's agenda */}
        <Card className="lg:col-span-3 border-border/70">
          <CardHeader className="px-5 pt-5 pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Agenda de hoje</CardTitle>
            {agendamentosHoje.length > 0 && (
              <span className="text-xs text-muted-foreground/50 tabular-nums">
                {agendamentosHoje.length} no total
              </span>
            )}
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {agendamentosHoje.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-5">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <CalendarDays className="w-5 h-5 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhuma consulta hoje
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  Clique em &ldquo;Novo Agendamento&rdquo; para agendar
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {agendamentosHoje.map((ag, i) => {
                  const st = statusAgendamento(ag.status);
                  return (
                    <div
                      key={ag.id}
                      className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30"
                    >
                      {/* Time */}
                      <div className="flex flex-col items-center gap-0.5 pt-0.5 min-w-[48px]">
                        <span className="text-sm font-semibold tabular-nums leading-none text-foreground">
                          {ag.horaInicio}
                        </span>
                        <span className="text-[10px] text-muted-foreground/40 leading-none">
                          {ag.horaFim}
                        </span>
                        {i < agendamentosHoje.length - 1 && (
                          <div className="w-px flex-1 bg-border/30 mt-1.5" />
                        )}
                      </div>

                      {/* Timeline dot */}
                      <div className="relative pt-2">
                        <div
                          className="w-2 h-2 rounded-full ring-[3px] ring-background"
                          style={{ backgroundColor: ag.profissional.cor }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">
                            {ag.paciente.nome}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 px-1.5 font-normal border-border/50 text-muted-foreground"
                          >
                            {st.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          Dr(a). {ag.profissional.nome}
                          <span className="mx-1.5 text-muted-foreground/30">·</span>
                          {ag.profissional.especialidade}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
