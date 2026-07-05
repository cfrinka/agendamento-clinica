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
    <div className="space-y-5">
      <Card className="border-border/70">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Pacientes</CardTitle>
            <Button size="sm" render={<Link href="/pacientes/novo" />}>
              <Plus className="w-4 h-4" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {pacientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-5">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Nenhum paciente cadastrado</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Clique em &ldquo;Novo&rdquo; para cadastrar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Nascimento</TableHead>
                  <TableHead className="text-center w-20">Consultas</TableHead>
                  <TableHead className="text-right w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientes.map((pac) => (
                  <TableRow key={pac.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-medium">
                            {pac.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{pac.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{pac.email || pac.telefone || "-"}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {pac.dataNascimento ? formatarData(pac.dataNascimento) : "-"}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm tabular-nums">
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
