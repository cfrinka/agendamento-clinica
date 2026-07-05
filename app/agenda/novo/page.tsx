"use client";

import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Profissional {
  id: number; nome: string; especialidade: string; cor: string;
}

interface Paciente {
  id: number; nome: string;
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
    profissionalId: "", pacienteId: "", data: new Date().toISOString().split("T")[0],
    horaInicio: "08:00", horaFim: "08:30", status: "agendado", observacoes: "",
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
      <div className="p-6 space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/agenda" />}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Agendar Consulta</h1>
          <p className="text-sm text-muted-foreground/70">Preencha os dados da consulta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-border/70">
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle className="text-sm font-semibold">Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pt-5 pb-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Profissional</Label>
              <Select
                value={form.profissionalId}
                onValueChange={(v) => setForm({ ...form, profissionalId: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nome} - {p.especialidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Paciente</Label>
              <Select
                value={form.pacienteId}
                onValueChange={(v) => setForm({ ...form, pacienteId: v ?? "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="link" size="sm" className="h-auto p-0 mt-0.5 text-xs" render={<Link href="/pacientes/novo" />}>
                <Plus className="w-3 h-3" />
                Cadastrar novo paciente
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="data" className="text-xs">Data</Label>
              <Input id="data" type="date" required value={form.data}
                onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="horaInicio" className="text-xs">Início</Label>
                <Input id="horaInicio" type="time" required value={form.horaInicio}
                  onChange={(e) => {
                    const h = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      horaInicio: h,
                      horaFim: prev.horaFim <= h
                        ? `${String(Number(h.split(":")[0]) + 1).padStart(2, "0")}:${h.split(":")[1]}`
                        : prev.horaFim,
                    }));
                  }} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="horaFim" className="text-xs">Fim</Label>
                <Input id="horaFim" type="time" required value={form.horaFim}
                  onChange={(e) => setForm({ ...form, horaFim: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v ?? "agendado" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="observacoes" className="text-xs">Observações</Label>
              <Textarea id="observacoes" value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Observações..." className="resize-none" rows={3} />
            </div>
          </CardContent>
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border/50">
            <Button variant="outline" size="sm" render={<Link href="/agenda" />}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              <Save className="w-4 h-4" />
              {loading ? "Salvando..." : "Agendar"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
