import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // Clean existing data
  await prisma.agendamento.deleteMany();
  await prisma.datasBloqueada.deleteMany();
  await prisma.horarioAtendimento.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.profissional.deleteMany();

  // ── Profissionais ──────────────────────────────────────────────
  const prof1 = await prisma.profissional.create({
    data: {
      nome: "Dra. Ana Beatriz Oliveira",
      especialidade: "Cardiologia",
      email: "ana.oliveira@clinica.com",
      telefone: "(11) 99999-1001",
      cor: "#3B82F6",
    },
  });

  const prof2 = await prisma.profissional.create({
    data: {
      nome: "Dr. Carlos Eduardo Santos",
      especialidade: "Dermatologia",
      email: "carlos.santos@clinica.com",
      telefone: "(11) 99999-1002",
      cor: "#10B981",
    },
  });

  const prof3 = await prisma.profissional.create({
    data: {
      nome: "Dra. Mariana Costa Lima",
      especialidade: "Pediatria",
      email: "mariana.lima@clinica.com",
      telefone: "(11) 99999-1003",
      cor: "#F59E0B",
    },
  });

  const prof4 = await prisma.profissional.create({
    data: {
      nome: "Dr. Rafael Almeida Neto",
      especialidade: "Ortopedia",
      email: "rafael.neto@clinica.com",
      telefone: "(11) 99999-1004",
      cor: "#8B5CF6",
    },
  });

  console.log("✅ Profissionais criados");

  // ── Pacientes ──────────────────────────────────────────────────
  const pacientes = await Promise.all([
    prisma.paciente.create({
      data: {
        nome: "João Pedro da Silva",
        email: "joao.silva@email.com",
        telefone: "(11) 98888-0001",
        dataNascimento: new Date("1985-03-15"),
        genero: "Masculino",
        endereco: "Rua das Flores, 123 - São Paulo, SP",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Maria Aparecida Souza",
        email: "maria.souza@email.com",
        telefone: "(11) 98888-0002",
        dataNascimento: new Date("1990-07-22"),
        genero: "Feminino",
        endereco: "Av. Paulista, 1500 - São Paulo, SP",
        observacoes: "Alérgica a dipirona",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Pedro Henrique Santos",
        email: "pedro.santos@email.com",
        telefone: "(11) 98888-0003",
        dataNascimento: new Date("1978-11-08"),
        genero: "Masculino",
        endereco: "Rua Augusta, 500 - São Paulo, SP",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Ana Carolina Ferreira",
        email: "ana.ferreira@email.com",
        telefone: "(11) 98888-0004",
        dataNascimento: new Date("1995-01-30"),
        genero: "Feminino",
        endereco: "Rua Oscar Freire, 800 - São Paulo, SP",
        observacoes: "Diabetes tipo 2",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Lucas Mendes Rocha",
        email: "lucas.rocha@email.com",
        telefone: "(11) 98888-0005",
        dataNascimento: new Date("2000-09-12"),
        genero: "Masculino",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Juliana Costa Barbosa",
        email: "juliana.barbosa@email.com",
        telefone: "(11) 98888-0006",
        dataNascimento: new Date("1982-05-18"),
        genero: "Feminino",
        endereco: "Rua da Consolação, 300 - São Paulo, SP",
        observacoes: "Hipertensão controlada",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Fernando Alves Neto",
        email: "fernando.neto@email.com",
        telefone: "(11) 98888-0007",
        dataNascimento: new Date("1975-12-03"),
        genero: "Masculino",
        endereco: "Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Camila Oliveira Dias",
        email: "camila.dias@email.com",
        telefone: "(11) 98888-0008",
        dataNascimento: new Date("2002-04-25"),
        genero: "Feminino",
        observacoes: "Asma brônquica",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Roberto Carlos Junior",
        email: "roberto.junior@email.com",
        telefone: "(11) 98888-0009",
        dataNascimento: new Date("1998-08-14"),
        genero: "Masculino",
        endereco: "Rua Teodoro Sampaio, 600 - São Paulo, SP",
      },
    }),
    prisma.paciente.create({
      data: {
        nome: "Patrícia Gomes de Paula",
        email: "patricia.paula@email.com",
        telefone: "(11) 98888-0010",
        dataNascimento: new Date("1988-06-20"),
        genero: "Feminino",
        endereco: "Rua Peixoto Gomide, 400 - São Paulo, SP",
      },
    }),
  ]);

  console.log("✅ Pacientes criados");

  // ── Horários de Atendimento ────────────────────────────────────
  const horariosPadrao = [
    { diaSemana: 1, horaInicio: "08:00", horaFim: "12:00" },
    { diaSemana: 1, horaInicio: "13:00", horaFim: "18:00" },
    { diaSemana: 2, horaInicio: "08:00", horaFim: "12:00" },
    { diaSemana: 2, horaInicio: "13:00", horaFim: "18:00" },
    { diaSemana: 3, horaInicio: "08:00", horaFim: "12:00" },
    { diaSemana: 3, horaInicio: "13:00", horaFim: "18:00" },
    { diaSemana: 4, horaInicio: "08:00", horaFim: "12:00" },
    { diaSemana: 4, horaInicio: "13:00", horaFim: "18:00" },
    { diaSemana: 5, horaInicio: "08:00", horaFim: "12:00" },
    { diaSemana: 5, horaInicio: "13:00", horaFim: "17:00" },
  ];

  for (const profissional of [prof1, prof2, prof3, prof4]) {
    for (const horario of horariosPadrao) {
      await prisma.horarioAtendimento.create({
        data: {
          profissionalId: profissional.id,
          diaSemana: horario.diaSemana,
          horaInicio: horario.horaInicio,
          horaFim: horario.horaFim,
        },
      });
    }
  }

  console.log("✅ Horários de atendimento criados");

  // ── Agendamentos ────────────────────────────────────────────────
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);

  const depoisAmanha = new Date(hoje);
  depoisAmanha.setDate(depoisAmanha.getDate() + 2);

  const datas = [hoje, amanha, depoisAmanha];

  const agendamentosData = [
    {
      profissionalId: prof1.id,
      pacienteId: pacientes[0].id,
      data: datas[0],
      horaInicio: "08:00",
      horaFim: "08:30",
      status: "confirmado",
    },
    {
      profissionalId: prof1.id,
      pacienteId: pacientes[3].id,
      data: datas[0],
      horaInicio: "09:00",
      horaFim: "09:30",
      status: "agendado",
    },
    {
      profissionalId: prof2.id,
      pacienteId: pacientes[1].id,
      data: datas[0],
      horaInicio: "08:00",
      horaFim: "08:30",
      status: "confirmado",
    },
    {
      profissionalId: prof2.id,
      pacienteId: pacientes[5].id,
      data: datas[0],
      horaInicio: "10:00",
      horaFim: "10:30",
      status: "em_andamento",
    },
    {
      profissionalId: prof3.id,
      pacienteId: pacientes[2].id,
      data: datas[0],
      horaInicio: "14:00",
      horaFim: "14:30",
      status: "concluido",
    },
    {
      profissionalId: prof3.id,
      pacienteId: pacientes[7].id,
      data: datas[0],
      horaInicio: "15:00",
      horaFim: "15:30",
      status: "agendado",
    },
    {
      profissionalId: prof4.id,
      pacienteId: pacientes[4].id,
      data: datas[0],
      horaInicio: "08:00",
      horaFim: "08:30",
      status: "agendado",
    },
    {
      profissionalId: prof4.id,
      pacienteId: pacientes[9].id,
      data: datas[0],
      horaInicio: "11:00",
      horaFim: "11:30",
      status: "cancelado",
    },
    // Amanhã
    {
      profissionalId: prof1.id,
      pacienteId: pacientes[6].id,
      data: datas[1],
      horaInicio: "08:00",
      horaFim: "08:30",
      status: "agendado",
    },
    {
      profissionalId: prof1.id,
      pacienteId: pacientes[8].id,
      data: datas[1],
      horaInicio: "10:00",
      horaFim: "10:30",
      status: "agendado",
    },
    {
      profissionalId: prof2.id,
      pacienteId: pacientes[2].id,
      data: datas[1],
      horaInicio: "09:00",
      horaFim: "09:30",
      status: "agendado",
    },
    {
      profissionalId: prof3.id,
      pacienteId: pacientes[0].id,
      data: datas[1],
      horaInicio: "08:00",
      horaFim: "08:30",
      status: "agendado",
    },
    {
      profissionalId: prof3.id,
      pacienteId: pacientes[4].id,
      data: datas[1],
      horaInicio: "14:00",
      horaFim: "14:30",
      status: "confirmado",
    },
    {
      profissionalId: prof4.id,
      pacienteId: pacientes[1].id,
      data: datas[1],
      horaInicio: "15:00",
      horaFim: "15:30",
      status: "agendado",
    },
    // Depois de amanhã
    {
      profissionalId: prof1.id,
      pacienteId: pacientes[5].id,
      data: datas[2],
      horaInicio: "08:00",
      horaFim: "08:30",
      status: "agendado",
    },
    {
      profissionalId: prof2.id,
      pacienteId: pacientes[7].id,
      data: datas[2],
      horaInicio: "14:00",
      horaFim: "14:30",
      status: "agendado",
    },
    {
      profissionalId: prof2.id,
      pacienteId: pacientes[3].id,
      data: datas[2],
      horaInicio: "16:00",
      horaFim: "16:30",
      status: "agendado",
    },
    {
      profissionalId: prof4.id,
      pacienteId: pacientes[6].id,
      data: datas[2],
      horaInicio: "09:00",
      horaFim: "09:30",
      status: "agendado",
    },
  ];

  for (const agendamento of agendamentosData) {
    await prisma.agendamento.create({ data: agendamento });
  }

  console.log("✅ Agendamentos criados");
  console.log("\n🎉 Seed concluído com sucesso!");
  console.log(`   ${4} profissionais`);
  console.log(`   ${pacientes.length} pacientes`);
  console.log(`   ${agendamentosData.length} agendamentos`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
