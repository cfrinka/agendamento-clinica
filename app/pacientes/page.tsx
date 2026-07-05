import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { formatarData } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PacientesPage() {
  const pacientes = await prisma.paciente.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { agendamentos: true } } },
  });

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground/60 mb-2">
            Gestão de pacientes
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-sm text-muted-foreground/80 mt-1.5">
            Gerenciar pacientes da clínica
          </p>
        </div>
        <Button render={<Link href="/pacientes/novo" />} className="shadow-sm shadow-primary/15">
          <Plus className="w-4 h-4" />
          Novo Paciente
        </Button>
      </div>

      <Card className="border border-border/60 shadow-sm rounded-2xl">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-base font-semibold">Todos os Pacientes</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {pacientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhum paciente cadastrado
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Clique em &ldquo;Novo Paciente&rdquo; para cadastrar
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data Nasc.</TableHead>
                  <TableHead className="text-center">Consultas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientes.map((pac) => (
                  <TableRow key={pac.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {pac.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{pac.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{pac.email || "-"}</div>
                      {pac.telefone && (
                        <div className="text-xs text-muted-foreground">
                          {pac.telefone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {pac.dataNascimento ? formatarData(pac.dataNascimento) : "-"}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {pac._count.agendamentos}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" render={<Link href={`/pacientes/${pac.id}`} />}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
