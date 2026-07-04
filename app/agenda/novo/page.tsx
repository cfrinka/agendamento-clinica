"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  cor: string;
}

interface Paciente {
  id: number;
  nome: string;
}

const statusOptions = [
  { value: "agendado", label: "Agendado" },
  { value: "confirmado", label: "Confirmado" },
  { value: "em_andamento", label: "Em Andamento" },
  { value: "concluido", label: "Concluído" },
  { value: "cancelado", label: "Cancelado" },
];

export default function NovoAgendamento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    profissionalId: "",
    pacienteId: "",
    data: new Date().toISOString().split("T")[0],
    horaInicio: "08:00",
    horaFim: "08:30",
    status: "agendado",
    observacoes: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/profissionais").then((r) => r.json()),
      fetch("/api/pacientes").then((r) => r.json()),
    ]).then(([profs, pacts]) => {
      setProfissionais(profs);
      setPacientes(pacts);
      setFetching(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/agenda");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao criar agendamento");
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <PageHeader title="Novo Agendamento">
        <Link
          href="/agenda"
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
              Profissional
            </label>
            <select
              required
              value={form.profissionalId}
              onChange={(e) =>
                setForm({ ...form, profissionalId: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Selecione...</option>
              {profissionais.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} - {p.especialidade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente
            </label>
            <select
              required
              value={form.pacienteId}
              onChange={(e) =>
                setForm({ ...form, pacienteId: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option value="">Selecione...</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <Link
              href="/pacientes/novo"
              className="text-xs text-primary hover:text-primary-dark mt-1 inline-block"
            >
              + Cadastrar novo paciente
            </Link>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              required
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora início
              </label>
              <input
                type="time"
                required
                value={form.horaInicio}
                onChange={(e) => {
                  const h = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    horaInicio: h,
                    horaFim:
                      prev.horaFim <= h
                        ? `${String(Number(h.split(":")[0]) + 1).padStart(2, "0")}:${h.split(":")[1]}`
                        : prev.horaFim,
                  }));
                }}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora fim
              </label>
              <input
                type="time"
                required
                value={form.horaFim}
                onChange={(e) =>
                  setForm({ ...form, horaFim: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={form.observacoes}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Observações sobre o agendamento..."
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Agendar"}
            </button>
            <Link
              href="/agenda"
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
