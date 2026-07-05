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
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProfissionaisPage() {
  const profissionais = await prisma.profissional.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { agendamentos: true } } },
  });

  return (
    <div className="space-y-5">
      <Card className="border-border/70">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Profissionais</CardTitle>
            <Button size="sm" render={<Link href="/profissionais/novo" />}>
              <Plus className="w-4 h-4" />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {profissionais.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-5">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Nenhum profissional cadastrado</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Clique em &ldquo;Novo&rdquo; para cadastrar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-center w-20">Consultas</TableHead>
                  <TableHead className="text-center w-20">Status</TableHead>
                  <TableHead className="text-right w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profissionais.map((prof) => (
                  <TableRow key={prof.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback
                            className="text-[10px] text-white font-medium"
                            style={{ backgroundColor: prof.cor }}
                          >
                            {prof.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{prof.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {prof.especialidade}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {prof.email}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-sm tabular-nums">
                      {prof._count.agendamentos}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={prof.ativo ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] h-5 px-1.5 font-normal",
                          prof.ativo
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                            : ""
                        )}
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
