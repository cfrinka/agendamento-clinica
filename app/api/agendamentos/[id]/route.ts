import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: Number(id) },
      include: {
        profissional: {
          select: { nome: true, especialidade: true, cor: true },
        },
        paciente: {
          select: { nome: true, telefone: true, email: true },
        },
      },
    });
    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(agendamento);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar agendamento" },
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

    if (body.horaInicio && body.horaFim && body.horaInicio >= body.horaFim) {
      return NextResponse.json(
        { error: "Hora de início deve ser anterior à hora de fim" },
        { status: 400 }
      );
    }

    const agendamento = await prisma.agendamento.update({
      where: { id: Number(id) },
      data: {
        profissionalId: body.profissionalId
          ? Number(body.profissionalId)
          : undefined,
        pacienteId: body.pacienteId
          ? Number(body.pacienteId)
          : undefined,
        data: body.data ? new Date(body.data) : undefined,
        horaInicio: body.horaInicio,
        horaFim: body.horaFim,
        status: body.status,
        observacoes: body.observacoes,
      },
    });
    return NextResponse.json(agendamento);
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
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
    await prisma.agendamento.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao excluir agendamento" },
      { status: 500 }
    );
  }
}
