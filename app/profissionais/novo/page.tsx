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
import { Save } from "lucide-react";
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

export default function NovoProfissional() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "", especialidade: "", email: "", telefone: "", cor: "#3B82F6",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profissionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/profissionais");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao criar profissional:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">
            Novo profissional
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cadastrar Profissional</h1>
          <p className="text-sm text-muted-foreground/80 mt-1.5">
            Preencha os dados do profissional
          </p>
        </div>
        <Button variant="outline" render={<Link href="/profissionais" />} className="rounded-xl">
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border border-border/60 shadow-sm rounded-2xl">
          <CardHeader className="px-6 pt-6 pb-4">
            <CardTitle className="text-base font-semibold">Dados do Profissional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Dr. Nome do Profissional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade</Label>
              <Select
                value={form.especialidade}
                onValueChange={(v) => setForm({ ...form, especialidade: v ?? "" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
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
                  placeholder="email@clinica.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  type="tel"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
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
          </CardContent>
          <div className="border-t border-border/50" />
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <Button variant="outline" render={<Link href="/profissionais" />} className="rounded-xl">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="shadow-sm shadow-primary/15 rounded-xl">
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
