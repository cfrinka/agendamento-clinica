import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        profissional: {
          select: { nome: true, especialidade: true, cor: true },
        },
        paciente: {
          select: { nome: true, telefone: true },
        },
      },
      orderBy: [{ data: "asc" }, { horaInicio: "asc" }],
    });
    return NextResponse.json(agendamentos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate time ranges
    if (body.horaInicio >= body.horaFim) {
      return NextResponse.json(
        { error: "Hora de início deve ser anterior à hora de fim" },
        { status: 400 }
      );
    }

    // Check for conflicting appointments
    const dataAg = new Date(body.data);
    const inicioDia = new Date(dataAg);
    inicioDia.setHours(0, 0, 0, 0);
    const fimDia = new Date(dataAg);
    fimDia.setHours(23, 59, 59, 999);

    const conflito = await prisma.agendamento.findFirst({
      where: {
        profissionalId: Number(body.profissionalId),
        data: {
          gte: inicioDia,
          lt: fimDia,
        },
        status: { not: "cancelado" },
        AND: [
          { horaInicio: { lt: body.horaFim } },
          { horaFim: { gt: body.horaInicio } },
        ],
      },
    });

    if (conflito) {
      return NextResponse.json(
        {
          error:
            "Conflito de horário: este profissional já possui um agendamento neste período",
        },
        { status: 409 }
      );
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        profissionalId: Number(body.profissionalId),
        pacienteId: Number(body.pacienteId),
        data: new Date(body.data),
        horaInicio: body.horaInicio,
        horaFim: body.horaFim,
        status: body.status || "agendado",
        observacoes: body.observacoes || null,
      },
      include: {
        profissional: {
          select: { nome: true, especialidade: true, cor: true },
        },
        paciente: {
          select: { nome: true, telefone: true },
        },
      },
    });
    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
