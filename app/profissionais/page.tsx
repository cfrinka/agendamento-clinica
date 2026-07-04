import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Plus, Edit, Stethoscope } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfissionaisPage() {
  const profissionais = await prisma.profissional.findMany({
    orderBy: { nome: "asc" },
    include: {
      _count: { select: { agendamentos: true } },
    },
  });

  return (
    <div className="pb-8">
      <PageHeader title="Profissionais" description="Gerenciar profissionais da clínica">
        <Link
          href="/profissionais/novo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Profissional
        </Link>
      </PageHeader>

      <div className="px-8 py-6">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {profissionais.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium text-gray-400">
                Nenhum profissional cadastrado
              </p>
              <p className="text-sm mt-1">
                Clique em &ldquo;Novo Profissional&rdquo; para cadastrar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Profissional
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Especialidade
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Consultas
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profissionais.map((prof) => (
                    <tr key={prof.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: prof.cor }}
                          >
                            {prof.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {prof.nome}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {prof.especialidade}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{prof.email}</div>
                        {prof.telefone && (
                          <div className="text-sm text-gray-400">{prof.telefone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {prof._count.agendamentos}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prof.ativo
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {prof.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/profissionais/${prof.id}`}
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
