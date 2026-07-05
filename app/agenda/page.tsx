import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        profissional: { select: { nome: true, especialidade: true, cor: true } },
        paciente: { select: { nome: true, telefone: true } },
      },
      orderBy: [{ data: "asc" }, { horaInicio: "asc" }],
    }),
  ]) as [ProfissionalAgenda[], AgendamentoComRelacoes[]];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground/70 mb-2">
            Agenda clínica
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Visualize e gerencie os agendamentos
          </p>
        </div>
        <Button render={<Link href="/agenda/novo" />}>
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      <AgendaCalendar
        profissionais={profissionais.map((p: ProfissionalAgenda) => ({
          id: p.id, nome: p.nome, especialidade: p.especialidade, cor: p.cor,
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
  );
}
