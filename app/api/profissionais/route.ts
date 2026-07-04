import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profissionais = await prisma.profissional.findMany({
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(profissionais);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar profissionais" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profissional = await prisma.profissional.create({
      data: {
        nome: body.nome,
        especialidade: body.especialidade,
        email: body.email,
        telefone: body.telefone || null,
        cor: body.cor || "#3B82F6",
      },
    });
    return NextResponse.json(profissional, { status: 201 });
  } catch (error) {
    if ((error as any)?.code === "P2002") {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar profissional" },
      { status: 500 }
    );
  }
}
