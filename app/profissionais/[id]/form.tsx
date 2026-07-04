"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

const especialidades = [
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Ginecologia",
  "Neurologia",
  "Ortopedia",
  "Pediatria",
  "Psiquiatria",
  "Clínico Geral",
  "Oftalmologia",
  "Otorrinolaringologia",
  "Urologia",
  "Outra",
];

const cores = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

interface ProfissionalFormProps {
  profissional: {
    id: number;
    nome: string;
    especialidade: string;
    email: string;
    telefone: string | null;
    cor: string;
    ativo: boolean;
  };
}

export function ProfissionalForm({ profissional }: ProfissionalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    nome: profissional.nome,
    especialidade: profissional.especialidade,
    email: profissional.email,
    telefone: profissional.telefone ?? "",
    cor: profissional.cor,
    ativo: profissional.ativo,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/profissionais/${profissional.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/profissionais");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este profissional?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/profissionais/${profissional.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/profissionais");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao excluir profissional:", error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="pb-8">
      <PageHeader title="Editar Profissional">
        <Link
          href="/profissionais"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </PageHeader>

      <div className="px-8 py-6 max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-border p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidade
            </label>
            <select
              required
              value={form.especialidade}
              onChange={(e) =>
                setForm({ ...form, especialidade: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                value={form.telefone}
                onChange={(e) =>
                  setForm({ ...form, telefone: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor do calendário
            </label>
            <div className="flex flex-wrap gap-2">
              {cores.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => setForm({ ...form, cor })}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    form.cor === cor
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) =>
                  setForm({ ...form, ativo: e.target.checked })
                }
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Profissional ativo
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Excluindo..." : "Excluir"}
            </button>
            <div className="flex items-center gap-3">
              <Link
                href="/profissionais"
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
