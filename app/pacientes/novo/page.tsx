"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NovoPaciente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", dataNascimento: "",
    genero: "", endereco: "", observacoes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/pacientes");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/pacientes" />}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Novo Paciente</h1>
          <p className="text-sm text-muted-foreground/70">Cadastrar novo paciente</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/70">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle className="text-sm font-semibold">Dados do Paciente</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-xs">Nome completo</Label>
              <Input id="nome" required value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome do paciente" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">E-mail</Label>
                <Input id="email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@paciente.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-xs">Telefone</Label>
                <Input id="telefone" type="tel" value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                  placeholder="(11) 99999-9999" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dataNascimento" className="text-xs">Data de nascimento</Label>
                <Input id="dataNascimento" type="date" value={form.dataNascimento}
                  onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Gênero</Label>
                <Select value={form.genero}
                  onValueChange={(v) => setForm({ ...form, genero: v ?? "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endereco" className="text-xs">Endereço</Label>
              <Input id="endereco" value={form.endereco}
                onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                placeholder="Rua, número, bairro, cidade" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="observacoes" className="text-xs">Observações</Label>
              <Textarea id="observacoes" value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Alergias, observações..." className="resize-none" rows={3} />
            </div>
          </CardContent>
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/50">
            <Button variant="outline" size="sm" render={<Link href="/pacientes" />}>Cancelar</Button>
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
