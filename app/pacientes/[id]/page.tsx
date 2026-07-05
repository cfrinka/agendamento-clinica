"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Paciente {
  id: number; nome: string; email: string | null; telefone: string | null;
  dataNascimento: string | null; genero: string | null;
  endereco: string | null; observacoes: string | null;
}

export default function EditarPaciente() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    nome: "", email: "", telefone: "", dataNascimento: "",
    genero: "", endereco: "", observacoes: "",
  });

  useEffect(() => {
    fetch(`/api/pacientes/${params.id}`)
      .then((res) => res.json())
      .then((data: Paciente) => {
        setForm({
          nome: data.nome,
          email: data.email ?? "",
          telefone: data.telefone ?? "",
          dataNascimento: data.dataNascimento
            ? new Date(data.dataNascimento).toISOString().split("T")[0]
            : "",
          genero: data.genero ?? "",
          endereco: data.endereco ?? "",
          observacoes: data.observacoes ?? "",
        });
      })
      .finally(() => setFetching(false));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/pacientes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/pacientes");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pacientes/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/pacientes");
        router.refresh();
      }
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
    } finally {
      setDeleting(false);
    }
  }

  if (fetching) {
    return (
      <div className="p-6 space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/pacientes" />}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Editar Paciente</h1>
          <p className="text-sm text-muted-foreground/70">{form.nome}</p>
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
                onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">E-mail</Label>
                <Input id="email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-xs">Telefone</Label>
                <Input id="telefone" type="tel" value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
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
                onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="observacoes" className="text-xs">Observações</Label>
              <Textarea id="observacoes" value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                className="resize-none" rows={3} />
            </div>
          </CardContent>
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/50">
            <Button type="button" variant="destructive" size="sm"
              onClick={handleDelete} disabled={deleting}>
              <Trash2 className="w-4 h-4" />
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" render={<Link href="/pacientes" />}>Cancelar</Button>
              <Button type="submit" size="sm" disabled={loading}>
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
