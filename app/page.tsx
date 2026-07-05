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
  ArrowRight,
  TrendingUp,
  Activity,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { cn, formatarData, statusAgendamento } from "@/lib/utils";

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

function GradientCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80 group">
      {children}
    </div>
  );
}

export default async function Dashboard() {
  const { totalPacientes, totalProfissionais, agendamentosHoje } =
    await getDashboardData();

  const statusCounts = agendamentosHoje.reduce(
    (acc, agendamento) => {
      acc[agendamento.status] = (acc[agendamento.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusData = [
    { key: "confirmado", label: "Confirmados", color: "bg-emerald-500", barColor: "bg-gradient-to-r from-emerald-400 to-emerald-500" },
    { key: "agendado", label: "Agendados", color: "bg-primary", barColor: "bg-gradient-to-r from-primary/80 to-primary" },
    { key: "em_andamento", label: "Em andamento", color: "bg-amber-500", barColor: "bg-gradient-to-r from-amber-400 to-amber-500" },
    { key: "concluido", label: "Concluídos", color: "bg-slate-500", barColor: "bg-gradient-to-r from-slate-400 to-slate-500" },
    { key: "cancelado", label: "Cancelados", color: "bg-red-500", barColor: "bg-gradient-to-r from-red-400 to-red-500" },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Visão geral da clínica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground/80 mt-1.5">
            {formatarData(new Date())}{" "}
            {agendamentosHoje.length > 0 && (
              <span className="inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-primary/8 text-primary text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {agendamentosHoje.length} consulta{agendamentosHoje.length !== 1 ? "s" : ""} hoje
              </span>
            )}
          </p>
        </div>
        <Button render={<Link href="/agenda/novo" />} className="shadow-sm shadow-primary/15">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GradientCard>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">Hoje</span>
            </div>
            <p className="text-xs text-muted-foreground/70 mb-1">Consultas</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">{agendamentosHoje.length}</span>
              <span className="text-sm text-muted-foreground/50">agendadas</span>
            </div>
          </CardContent>
        </GradientCard>

        <GradientCard>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50">
                <Users className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-muted-foreground/70 mb-1">Total de Pacientes</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">{totalPacientes}</span>
              <span className="text-sm text-muted-foreground/50">cadastrados</span>
            </div>
          </CardContent>
        </GradientCard>

        <GradientCard>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 ring-1 ring-purple-200/50">
                <Stethoscope className="w-5 h-5" />
              </div>
              <UserCheck className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs text-muted-foreground/70 mb-1">Profissionais</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-foreground">{totalProfissionais}</span>
              <span className="text-sm text-muted-foreground/50">ativos</span>
            </div>
          </CardContent>
        </GradientCard>

        <GradientCard>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 ring-1 ring-amber-200/50">
                <Clock className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-muted-foreground/70 mb-1">Próxima Consulta</p>
            {agendamentosHoje.length > 0 ? (
              <div>
                <span className="text-3xl font-bold tracking-tight text-foreground">{agendamentosHoje[0].horaInicio}</span>
                <p className="text-xs text-muted-foreground/70 mt-1 truncate">{agendamentosHoje[0].paciente.nome}</p>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-bold tracking-tight text-muted-foreground/50">---</span>
                <p className="text-xs text-muted-foreground/50 mt-1">Nenhuma consulta agendada</p>
              </div>
            )}
          </CardContent>
        </GradientCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Status distribution */}
        <Card className="lg:col-span-2 border border-border/60 shadow-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <CardTitle className="text-base font-semibold">Distribuição de status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            {statusData.map((status) => {
              const count = statusCounts[status.key] ?? 0;
              const percentage = agendamentosHoje.length
                ? Math.round((count / agendamentosHoje.length) * 100)
                : 0;

              return (
                <div key={status.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      <span className="text-sm text-muted-foreground">{status.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground tabular-nums">{count}</span>
                      <span className="text-xs text-muted-foreground/50 w-8 text-right tabular-nums">{percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted/70">
                    <div
                      className={`${status.barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {agendamentosHoje.length === 0 && (
              <p className="text-sm text-muted-foreground/60 text-center py-4">Nenhum agendamento para hoje</p>
            )}
          </CardContent>
        </Card>

        {/* Today's appointments */}
        <Card className="lg:col-span-3 border border-border/60 shadow-sm">
          <CardHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <CardTitle className="text-base font-semibold">Agenda de Hoje</CardTitle>
              </div>
              {agendamentosHoje.length > 0 && (
                <span className="text-xs text-muted-foreground/50">
                  {agendamentosHoje.length} consulta{agendamentosHoje.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {agendamentosHoje.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5">
                  <CalendarDays className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <p className="text-base font-medium text-muted-foreground">
                  Nenhuma consulta hoje
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1.5 max-w-xs">
                  Clique em &ldquo;Novo Agendamento&rdquo; para agendar uma consulta
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {agendamentosHoje.map((agendamento, index) => {
                  const status = statusAgendamento(agendamento.status);
                  return (
                    <div
                      key={agendamento.id}
                      className="flex items-start gap-4 px-6 py-4 transition-all duration-200 hover:bg-muted/30 group"
                    >
                      {/* Time column */}
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <span className="text-sm font-semibold text-foreground tabular-nums leading-none">
                          {agendamento.horaInicio}
                        </span>
                        <span className="text-[10px] text-muted-foreground/40 leading-none">
                          {agendamento.horaFim}
                        </span>
                        {index < agendamentosHoje.length - 1 && (
                          <div className="w-px flex-1 min-h-[8px] bg-border/40 mt-1" />
                        )}
                      </div>

                      {/* Timeline dot */}
                      <div className="relative flex flex-col items-center pt-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full ring-4 ring-background"
                          style={{ backgroundColor: agendamento.profissional.cor }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">
                            {agendamento.paciente.nome}
                          </span>
                          <Badge
                            className={cn(
                              "text-[10px] h-5 px-2 font-medium",
                              status.color === "bg-blue-100 text-blue-800"
                                ? "bg-primary/8 text-primary hover:bg-primary/12"
                                : status.color === "bg-green-100 text-green-800"
                                  ? "bg-emerald-100/80 text-emerald-700 hover:bg-emerald-100"
                                  : status.color === "bg-yellow-100 text-yellow-800"
                                    ? "bg-amber-100/80 text-amber-700 hover:bg-amber-100"
                                    : status.color === "bg-gray-100 text-gray-800"
                                      ? "bg-muted/70 text-muted-foreground hover:bg-muted"
                                      : "bg-red-100/80 text-red-700 hover:bg-red-100"
                            )}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground/70">
                          <span className="flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5" />
                            Dr(a). {agendamento.profissional.nome}
                          </span>
                          <span className="text-muted-foreground/30">·</span>
                          <span>{agendamento.profissional.especialidade}</span>
                        </div>
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
