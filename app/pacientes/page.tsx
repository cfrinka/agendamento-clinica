import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Plus, Edit, Users } from "lucide-react";
import Link from "next/link";
import { formatarData } from "@/lib/utils";

export default async function PacientesPage() {
  const pacientes = await prisma.paciente.findMany({
    orderBy: { nome: "asc" },
    include: {
      _count: { select: { agendamentos: true } },
    },
  });

  return (
    <div className="pb-8">
      <PageHeader title="Pacientes" description="Gerenciar pacientes da clínica">
        <Link
          href="/pacientes/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </Link>
      </PageHeader>

      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {pacientes.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium text-gray-400">
                Nenhum paciente cadastrado
              </p>
              <p className="text-sm mt-1">
                Clique em &ldquo;Novo Paciente&rdquo; para cadastrar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Data Nasc.
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Consultas
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pacientes.map((pac) => (
                    <tr key={pac.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-medium">
                            {pac.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {pac.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{pac.email || "-"}</div>
                        {pac.telefone && (
                          <div className="text-sm text-gray-400">{pac.telefone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pac.dataNascimento ? formatarData(pac.dataNascimento) : "-"}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {pac._count.agendamentos}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/pacientes/${pac.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
