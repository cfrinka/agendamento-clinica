import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(pacientes);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pacientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paciente = await prisma.paciente.create({
      data: {
        nome: body.nome,
        email: body.email || null,
        telefone: body.telefone || null,
        dataNascimento: body.dataNascimento
          ? new Date(body.dataNascimento)
          : null,
        genero: body.genero || null,
        endereco: body.endereco || null,
        observacoes: body.observacoes || null,
      },
    });
    return NextResponse.json(paciente, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar paciente" },
      { status: 500 }
    );
  }
}
