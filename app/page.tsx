import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { CalendarDays, Stethoscope, Users, Clock } from "lucide-react";
import Link from "next/link";
import { formatarData } from "@/lib/utils";

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
          data: {
            gte: hoje,
            lt: amanha,
          },
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

  const hoje = formatarData(new Date());

  return (
    <div className="pb-8">
      <PageHeader
        title="Dashboard"
        description={`Resumo da clínica — ${hoje}`}
      />

      <div className="px-8 py-6">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultas Hoje</p>
                <p className="text-2xl font-bold">
                  {agendamentosHoje.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Pacientes</p>
                <p className="text-2xl font-bold">{totalPacientes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Profissionais</p>
                <p className="text-2xl font-bold">{totalProfissionais}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's appointments */}
        <div className="bg-white rounded-xl border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold">Agenda de Hoje</h2>
            <Link
              href="/agenda/novo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Clock className="w-4 h-4" />
              Novo Agendamento
            </Link>
          </div>

          <div className="divide-y divide-border">
            {agendamentosHoje.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium text-gray-400">
                  Nenhuma consulta hoje
                </p>
                <p className="text-sm mt-1">
                  Clique em &ldquo;Novo Agendamento&rdquo; para agendar
                </p>
              </div>
            ) : (
              agendamentosHoje.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: agendamento.profissional.cor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {agendamento.paciente.nome}
                      </span>
                      <StatusBadge status={agendamento.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
