import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AgendaCalendar } from "./agenda-calendar";
import type { Profissional, Agendamento } from "@prisma/client";

export const dynamic = "force-dynamic";

type ProfissionalAgenda = Pick<Profissional, "id" | "nome" | "especialidade" | "cor">;

interface AgendamentoComRelacoes extends Agendamento {
  profissional: { nome: string; especialidade: string; cor: string };
  paciente: { nome: string; telefone: string | null };
}

export default async function AgendaPage() {
  const [profissionais, agendamentos] = await Promise.all([
    prisma.profissional.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    }),
    prisma.agendamento.findMany({
      include: {
        profissional: {
          select: { nome: true, especialidade: true, cor: true },
        },
        paciente: { select: { nome: true, telefone: true } },
      },
      orderBy: [{ data: "asc" }, { horaInicio: "asc" }],
    }),
  ]) as [ProfissionalAgenda[], AgendamentoComRelacoes[]];

  return (
    <div className="pb-8">
      <PageHeader
        title="Agenda"
        description="Visualize e gerencie os agendamentos"
      >
        <Link
          href="/agenda/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Link>
      </PageHeader>

      <div className="px-8 py-6">
        <AgendaCalendar
          profissionais={profissionais.map((p: ProfissionalAgenda) => ({
            id: p.id,
            nome: p.nome,
            especialidade: p.especialidade,
            cor: p.cor,
          }))}
          agendamentos={agendamentos.map((a: AgendamentoComRelacoes) => ({
            id: a.id,
            profissionalId: a.profissionalId,
            data: a.data.toISOString(),
            horaInicio: a.horaInicio,
            horaFim: a.horaFim,
            status: a.status,
            profissional: a.profissional,
            paciente: a.paciente,
          }))}
        />
      </div>
    </div>
  );
}
