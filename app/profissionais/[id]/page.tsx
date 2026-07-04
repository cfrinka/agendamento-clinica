import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProfissionalForm } from "./form";

export default async function EditarProfissionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profissional = await prisma.profissional.findUnique({
    where: { id: Number(id) },
  });

  if (!profissional) {
    notFound();
  }

  return <ProfissionalForm profissional={profissional} />;
}
