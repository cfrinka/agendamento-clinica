import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(id) },
    });
    if (!paciente) {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(paciente);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar paciente" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const paciente = await prisma.paciente.update({
      where: { id: Number(id) },
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
    return NextResponse.json(paciente);
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar paciente" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.paciente.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Paciente não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao excluir paciente" },
      { status: 500 }
    );
  }
}
