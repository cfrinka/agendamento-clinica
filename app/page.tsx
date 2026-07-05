import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Stethoscope, Users, Clock, Plus } from "lucide-react";
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
    { key: "confirmado", label: "Confirmados", color: "bg-emerald-500" },
    { key: "agendado", label: "Agendados", color: "bg-primary" },
    { key: "em_andamento", label: "Em andamento", color: "bg-amber-500" },
    { key: "concluido", label: "Concluídos", color: "bg-slate-500" },
    { key: "cancelado", label: "Cancelados", color: "bg-red-500" },
  ];

  const totalStatus = agendamentosHoje.length || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground/70 mb-2">
            Visão geral da clínica
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Resumo da clínica — {formatarData(new Date())}
          </p>
        </div>
        <Button render={<Link href="/agenda/novo" />}>
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consultas Hoje</p>
              <p className="text-3xl font-semibold">{agendamentosHoje.length}</p>
            </div>
            <p className="text-sm text-muted-foreground/70">
              Total de consultas agendadas para hoje.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Pacientes</p>
              <p className="text-3xl font-semibold">{totalPacientes}</p>
            </div>
            <p className="text-sm text-muted-foreground/70">
              Pacientes cadastrados em sua clínica.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profissionais</p>
              <p className="text-3xl font-semibold">{totalProfissionais}</p>
            </div>
            <p className="text-sm text-muted-foreground/70">
              Profissionais ativos disponíveis para agendamento.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Próxima Consulta</p>
              <p className="text-3xl font-semibold">
                {agendamentosHoje.length > 0
                  ? `${agendamentosHoje[0].horaInicio}`
                  : "---"}
              </p>
            </div>
            <p className="text-sm text-muted-foreground/70">
              {agendamentosHoje.length > 0
                ? agendamentosHoje[0].paciente.nome
                : "Nenhuma consulta agendada"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status distribution */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="px-6 py-5">
          <CardTitle className="text-lg">Distribuição de status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          {statusData.map((status) => {
            const count = statusCounts[status.key] ?? 0;
            const percentage = agendamentosHoje.length
              ? Math.round((count / agendamentosHoje.length) * 100)
              : 0;

            return (
              <div key={status.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{status.label}</span>
                  <span className="font-semibold text-foreground">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`${status.color} h-full rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Today's appointments */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="px-6 py-5">
          <CardTitle className="text-lg">Agenda de Hoje</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {agendamentosHoje.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <CalendarDays className="w-14 h-14 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhuma consulta hoje
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Clique em &ldquo;Novo Agendamento&rdquo; para agendar
              </p>
            </div>
          ) : (
            <div className="divide-y border-t border-border">
              {agendamentosHoje.map((agendamento) => {
                const status = statusAgendamento(agendamento.status);
                return (
                  <div
                    key={agendamento.id}
                    className="flex items-center gap-4 px-6 py-5 hover:bg-muted/40 transition-colors"
                  >
                    <div
                      className="w-1 rounded-full shrink-0 h-14"
                      style={{ backgroundColor: agendamento.profissional.cor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {agendamento.paciente.nome}
                        </span>
                        <Badge
                          className={
                            status.color === "bg-blue-100 text-blue-800"
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : status.color === "bg-green-100 text-green-800"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : status.color === "bg-yellow-100 text-yellow-800"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                  : status.color === "bg-gray-100 text-gray-800"
                                    ? "bg-muted text-muted-foreground hover:bg-muted"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {status.label}
                        </Badge>
                      </div>
                      <div className="mt-2 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {agendamento.horaInicio} - {agendamento.horaFim}
                        </span>
                        <span className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          Dr(a). {agendamento.profissional.nome}
                        </span>
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
  );
}
