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
import { Save, ArrowLeft } from "lucide-react";
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
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/profissionais" />}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Novo Profissional</h1>
          <p className="text-sm text-muted-foreground/70">Cadastrar novo profissional</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/70">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle className="text-sm font-semibold">Dados do Profissional</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-xs">Nome completo</Label>
              <Input id="nome" required value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Dr. Nome do Profissional" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="especialidade" className="text-xs">Especialidade</Label>
              <Select value={form.especialidade}
                onValueChange={(v) => setForm({ ...form, especialidade: v ?? "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">E-mail</Label>
                <Input id="email" type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@clinica.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-xs">Telefone</Label>
                <Input id="telefone" type="tel" value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(11) 99999-9999" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Cor do calendário</Label>
              <div className="flex flex-wrap gap-1.5">
                {cores.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    onClick={() => setForm({ ...form, cor })}
                    className={`w-7 h-7 rounded-md transition-all ${
                      form.cor === cor
                        ? "ring-2 ring-offset-1 ring-foreground/30 scale-110"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/50">
            <Button variant="outline" size="sm" render={<Link href="/profissionais" />}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
