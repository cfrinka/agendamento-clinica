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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumo da clínica — {formatarData(new Date())}
          </p>
        </div>
        <Button render={<Link href="/agenda/novo" />}>
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consultas Hoje</p>
              <p className="text-2xl font-bold">{agendamentosHoje.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Pacientes</p>
              <p className="text-2xl font-bold">{totalPacientes}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profissionais</p>
              <p className="text-2xl font-bold">{totalProfissionais}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Hoje</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {agendamentosHoje.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhuma consulta hoje
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Clique em &ldquo;Novo Agendamento&rdquo; para agendar
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {agendamentosHoje.map((agendamento) => {
                const status = statusAgendamento(agendamento.status);
                return (
                  <div
                    key={agendamento.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <div
                      className="w-1 h-12 rounded-full shrink-0"
                      style={{ backgroundColor: agendamento.profissional.cor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
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
                      <div className="flex items-center gap-3 mt-0.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {agendamento.horaInicio} - {agendamento.horaFim}
                        </span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
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
