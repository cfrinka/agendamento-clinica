import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const profissional = await prisma.profissional.findUnique({
      where: { id: Number(id) },
    });
    if (!profissional) {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(profissional);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar profissional" },
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
    const profissional = await prisma.profissional.update({
      where: { id: Number(id) },
      data: {
        nome: body.nome,
        especialidade: body.especialidade,
        email: body.email,
        telefone: body.telefone || null,
        cor: body.cor,
        ativo: body.ativo,
      },
    });
    return NextResponse.json(profissional);
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar profissional" },
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
    await prisma.profissional.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Profissional não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao excluir profissional" },
      { status: 500 }
    );
  }
}
