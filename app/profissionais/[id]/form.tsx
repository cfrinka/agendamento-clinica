"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

const especialidades = [
  "Cardiologia", "Dermatologia", "Endocrinologia", "Gastroenterologia",
  "Ginecologia", "Neurologia", "Ortopedia", "Pediatria",
  "Psiquiatria", "Clínico Geral", "Oftalmologia", "Otorrinolaringologia",
  "Urologia", "Outra",
];

const cores = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
  "#F97316", "#6366F1",
];

interface ProfissionalFormProps {
  profissional: {
    id: number; nome: string; especialidade: string; email: string;
    telefone: string | null; cor: string; ativo: boolean;
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground/70 mb-2">
            Editar profissional
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{profissional.nome}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Atualize os dados do profissional
          </p>
        </div>
        <Button variant="outline" render={<Link href="/profissionais" />}>
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados do Profissional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Select
                value={form.especialidade}
                onValueChange={(v) => setForm({ ...form, especialidade: v ?? "" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cor do calendário</Label>
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ativo"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
              />
              <Label htmlFor="ativo" className="font-medium">Profissional ativo</Label>
            </div>
          </CardContent>
          <Separator />
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" render={<Link href="/profissionais" />}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4" />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
