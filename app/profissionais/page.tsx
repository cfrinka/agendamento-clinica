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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Stethoscope } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfissionaisPage() {
  const profissionais = await prisma.profissional.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { agendamentos: true } } },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profissionais</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerenciar profissionais da clínica
          </p>
        </div>
        <Button render={<Link href="/profissionais/novo" />}>
          <Plus className="w-4 h-4" />
          Novo Profissional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {profissionais.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Stethoscope className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhum profissional cadastrado
              </p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Clique em &ldquo;Novo Profissional&rdquo; para cadastrar
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-center">Consultas</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profissionais.map((prof) => (
                  <TableRow key={prof.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback
                            className="text-white text-xs font-medium"
                            style={{ backgroundColor: prof.cor }}
                          >
                            {prof.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{prof.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {prof.especialidade}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{prof.email}</div>
                      {prof.telefone && (
                        <div className="text-xs text-muted-foreground">
                          {prof.telefone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {prof._count.agendamentos}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={prof.ativo ? "default" : "secondary"}
                        className={
                          prof.ativo
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }
                      >
                        {prof.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" render={<Link href={`/profissionais/${prof.id}`} />}>
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
