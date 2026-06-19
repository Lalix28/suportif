import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/auth/password";
import { calculateLevel, buildXpDedupeKey } from "../src/lib/xp/level";
import { calculateSimulationResult } from "../src/lib/simulations/results";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "suportif123";

const trackDefinitions = [
  {
    title: "Redes de Computadores",
    slug: "redes-de-computadores",
    area: "Tecnologia",
    level: "BASIC",
    coverIcon: "network",
    color: "emerald",
    modules: [
      "O que é uma rede",
      "IP, máscara e gateway",
      "DNS",
      "HTTP e HTTPS",
      "Ping e traceroute",
      "Portas e serviços"
    ]
  },
  {
    title: "Linux Básico",
    slug: "linux-basico",
    area: "Sistemas Operacionais",
    level: "INTRODUCTORY",
    coverIcon: "terminal",
    color: "slate",
    modules: [
      "O que é Linux",
      "Terminal",
      "Comandos básicos",
      "Navegação em diretórios",
      "Arquivos e permissões",
      "Pipes e redirecionamento"
    ]
  },
  {
    title: "Programação do Zero",
    slug: "programacao-do-zero",
    area: "Programação",
    level: "INTRODUCTORY",
    coverIcon: "code",
    color: "blue",
    modules: ["Algoritmos", "Variáveis", "Condicionais", "Laços", "Funções", "Listas", "Mini projetos"]
  },
  {
    title: "Matemática para Tecnologia",
    slug: "matematica-para-tecnologia",
    area: "Matemática",
    level: "BASIC",
    coverIcon: "calculator",
    color: "violet",
    modules: [
      "Porcentagem",
      "Regra de três",
      "Unidades de medida",
      "Potência e notação científica",
      "Funções e gráficos",
      "Lógica matemática"
    ]
  },
  {
    title: "Inglês Técnico",
    slug: "ingles-tecnico",
    area: "Idiomas",
    level: "INTRODUCTORY",
    coverIcon: "book-open",
    color: "cyan",
    modules: [
      "Termos comuns de interface",
      "Erros de terminal",
      "Vocabulário de redes",
      "Vocabulário de programação",
      "Leitura de README"
    ]
  },
  {
    title: "Cybersegurança Inicial",
    slug: "cyberseguranca-inicial",
    area: "Segurança",
    level: "BASIC",
    coverIcon: "shield",
    color: "rose",
    modules: ["Ética", "Senhas", "Phishing", "Logs", "Portas e serviços", "Mini desafios defensivos"]
  },
  {
    title: "Concurso / Edital",
    slug: "concurso-edital",
    area: "Estudos por edital",
    level: "INTRODUCTORY",
    coverIcon: "file-text",
    color: "amber",
    modules: ["Cadastro de edital", "Disciplinas", "Assuntos", "Questões", "Simulados", "Revisões"]
  }
] as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function buildMissionContent(trackTitle: string, moduleTitle: string) {
  if (moduleTitle === "IP, máscara e gateway") {
    return {
      title: "IP, máscara e gateway sem complicar",
      slug: "ip-mascara-e-gateway-sem-complicar",
      shortDescription: "Missão demonstrativa, fictícia e não oficial sobre fundamentos de rede.",
      objective: "Diferenciar IP, máscara e gateway em um cenário doméstico demonstrativo.",
      quickExplanation:
        "IP identifica um dispositivo na rede. Máscara indica qual parte do endereço pertence à rede. Gateway é o caminho usado para sair da rede local.",
      detailedExplanation:
        "Pense no IP como o endereço de uma casa. A máscara mostra qual é o bairro. O gateway é a saída principal para falar com outros bairros.",
      analogy:
        "Em um bairro fictício, o IP é a casa, a máscara delimita o bairro e o gateway é a avenida que leva para fora dele.",
      practicalExample:
        "Seu computador 192.168.1.10 usa o roteador 192.168.1.1 como gateway para acessar a internet.",
      guidedExercisePrompt: "Em uma rede doméstica demonstrativa, qual endereço normalmente representa o gateway?",
      challengePrompt:
        "Dado um cenário com IP, máscara e gateway fictícios, identifique qual configuração está incoerente.",
      summary: "IP identifica, máscara define a rede e gateway permite comunicação com outras redes.",
      attentionPoints: [
        "Conteúdo demonstrativo e não oficial.",
        "Não confundir gateway com DNS.",
        "A mesma rede local precisa de endereços compatíveis."
      ]
    };
  }

  return {
    title: `Fundamentos de ${moduleTitle}`,
    slug: `fundamentos-de-${slugify(moduleTitle)}`,
    shortDescription: `Missão demonstrativa, fictícia e não oficial da trilha ${trackTitle}.`,
    objective: `Reconhecer a ideia central de ${moduleTitle} em um contexto simples de estudo.`,
    quickExplanation: `${moduleTitle} é apresentado aqui como um conceito inicial para organizar o estudo progressivo.`,
    detailedExplanation: `Nesta missão demonstrativa, ${moduleTitle} aparece em uma situação guiada, com exemplos curtos e sem conteúdo oficial de instituição, edital ou curso.`,
    analogy: `Pense em ${moduleTitle} como uma peça de um mapa: ela ajuda a entender onde você está antes de avançar.`,
    practicalExample: `Um estudante usa ${moduleTitle} para resolver uma tarefa curta e registrar progresso dentro da plataforma.`,
    guidedExercisePrompt: `Qual alternativa descreve melhor o papel de ${moduleTitle} nesta missão demonstrativa?`,
    challengePrompt: `Escolha a opção que aplica ${moduleTitle} de forma coerente em um cenário fictício.`,
    summary: `${moduleTitle} foi introduzido como fundamento demonstrativo para estudos posteriores.`,
    attentionPoints: [
      "Conteúdo demonstrativo, fictício e não oficial.",
      "Validar conteúdo real posteriormente com material fornecido pelo usuário.",
      "Não há execução real de código no MVP."
    ]
  };
}

async function resetDatabase() {
  await prisma.simulationAnswer.deleteMany();
  await prisma.simulationAttempt.deleteMany();
  await prisma.simulationQuestion.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.exerciseAttempt.deleteMany();
  await prisma.exerciseOption.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.reviewSchedule.deleteMany();
  await prisma.userSkillProgress.deleteMany();
  await prisma.missionProgress.deleteMany();
  await prisma.xPTransaction.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.engagementSignal.deleteMany();
  await prisma.teacherNote.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.missionPrerequisite.deleteMany();
  await prisma.missionTag.deleteMany();
  await prisma.missionSkill.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.module.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.track.deleteMany();
  await prisma.contentTag.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.classMembership.deleteMany();
  await prisma.classGroup.deleteMany();
  await prisma.examTopic.deleteMany();
  await prisma.examSubject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.session.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await resetDatabase();

  const passwordHash = await hashPassword(DEMO_PASSWORD);

  async function createUser(input: {
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    totalXp: number;
    streak: number;
    lastLoginDaysAgo?: number;
  }) {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        lastLoginAt:
          input.lastLoginDaysAgo === undefined ? new Date() : daysFromNow(-input.lastLoginDaysAgo),
        profile: {
          create: {
            totalXp: input.totalXp,
            level: calculateLevel(input.totalXp),
            streak: input.streak,
            bio: "Perfil demonstrativo, fictício e não oficial para validação local do MVP."
          }
        }
      },
      include: { profile: true }
    });
  }

  const admin = await createUser({
    name: "Admin SuportIF",
    email: "admin@suportif.dev",
    role: "ADMIN",
    totalXp: 0,
    streak: 0
  });

  const teacher = await createUser({
    name: "Professor Demo",
    email: "professor@suportif.dev",
    role: "TEACHER",
    totalXp: 0,
    streak: 0
  });

  const students = [
    await createUser({
      name: "Aluno Demo",
      email: "aluno@suportif.dev",
      role: "STUDENT",
      totalXp: 760,
      streak: 4,
      lastLoginDaysAgo: 1
    }),
    await createUser({
      name: "Ana Demo",
      email: "ana.demo@suportif.dev",
      role: "STUDENT",
      totalXp: 340,
      streak: 2,
      lastLoginDaysAgo: 3
    }),
    await createUser({
      name: "Bruno Demo",
      email: "bruno.demo@suportif.dev",
      role: "STUDENT",
      totalXp: 120,
      streak: 0,
      lastLoginDaysAgo: 12
    }),
    await createUser({
      name: "Carla Demo",
      email: "carla.demo@suportif.dev",
      role: "STUDENT",
      totalXp: 520,
      streak: 5,
      lastLoginDaysAgo: 0
    }),
    await createUser({
      name: "Diego Demo",
      email: "diego.demo@suportif.dev",
      role: "STUDENT",
      totalXp: 80,
      streak: 0,
      lastLoginDaysAgo: 20
    })
  ];

  const classGroup = await prisma.classGroup.create({
    data: {
      name: "Turma Demonstrativa SuportIF",
      description:
        "Turma fictícia para validar acompanhamento de engajamento e progresso. Não representa turma real.",
      isDemo: true
    }
  });

  await prisma.classMembership.createMany({
    data: [
      { userId: teacher.id, classGroupId: classGroup.id, roleInClass: "TEACHER" },
      ...students.map((student) => ({
        userId: student.id,
        classGroupId: classGroup.id,
        roleInClass: "STUDENT" as const
      }))
    ]
  });

  const tags = await Promise.all(
    [
      ["Demonstrativo", "demonstrativo"],
      ["Fictício", "ficticio"],
      ["Não oficial", "nao-oficial"],
      ["Fundamentos", "fundamentos"],
      ["Revisão", "revisao"]
    ].map(([name, slug]) =>
      prisma.contentTag.create({
        data: {
          name,
          slug
        }
      })
    )
  );

  const missions: Array<{
    trackSlug: string;
    moduleSlug: string;
    missionId: string;
    skillId: string;
    skillSlug: string;
    exercises: Array<{ id: string; correctOptionId: string; wrongOptionId: string }>;
  }> = [];

  const tracks = new Map<string, { id: string; slug: string }>();
  let previousMissionIdByTrack = new Map<string, string>();

  for (const trackDefinition of trackDefinitions) {
    const track = await prisma.track.create({
      data: {
        title: trackDefinition.title,
        slug: trackDefinition.slug,
        description:
          "Trilha demonstrativa, fictícia e não oficial. Serve para validar o MVP e receber conteúdo real posteriormente.",
        area: trackDefinition.area,
        level: trackDefinition.level,
        coverIcon: trackDefinition.coverIcon,
        color: trackDefinition.color,
        isPublic: true,
        isDemo: true
      }
    });
    tracks.set(track.slug, track);

    for (const [moduleIndex, moduleTitle] of trackDefinition.modules.entries()) {
      const moduleSlug = slugify(moduleTitle);
      const trackModule = await prisma.module.create({
        data: {
          trackId: track.id,
          title: moduleTitle,
          slug: moduleSlug,
          description: `Módulo demonstrativo, fictício e não oficial sobre ${moduleTitle}.`,
          order: moduleIndex + 1,
          isDemo: true
        }
      });

      const skill = await prisma.skill.create({
        data: {
          name: `Fundamento: ${moduleTitle}`,
          slug: `${track.slug}-${moduleSlug}`,
          description: `Habilidade demonstrativa, fictícia e não oficial vinculada a ${moduleTitle}.`
        }
      });

      const missionContent = buildMissionContent(track.title, moduleTitle);
      const mission = await prisma.mission.create({
        data: {
          moduleId: trackModule.id,
          title: missionContent.title,
          slug: missionContent.slug,
          shortDescription: missionContent.shortDescription,
          objective: missionContent.objective,
          quickExplanation: missionContent.quickExplanation,
          detailedExplanation: missionContent.detailedExplanation,
          analogy: missionContent.analogy,
          practicalExample: missionContent.practicalExample,
          guidedExercisePrompt: missionContent.guidedExercisePrompt,
          challengePrompt: missionContent.challengePrompt,
          summary: missionContent.summary,
          attentionPoints: missionContent.attentionPoints,
          difficulty: moduleIndex === 0 ? "INTRODUCTORY" : "BASIC",
          xpReward: moduleIndex === 0 ? 40 : 60,
          estimatedMinutes: 8 + moduleIndex,
          order: 1,
          isDemo: true,
          skills: {
            create: {
              skillId: skill.id
            }
          },
          tags: {
            create: tags.map((tag) => ({ tagId: tag.id }))
          }
        }
      });

      const previousMissionId = previousMissionIdByTrack.get(track.slug);
      if (previousMissionId) {
        await prisma.missionPrerequisite.create({
          data: {
            missionId: mission.id,
            prerequisiteId: previousMissionId
          }
        });
      }
      previousMissionIdByTrack = new Map(previousMissionIdByTrack).set(track.slug, mission.id);

      const guidedExercise = await prisma.exercise.create({
        data: {
          missionId: mission.id,
          type: "MULTIPLE_CHOICE",
          prompt: missionContent.guidedExercisePrompt,
          explanation:
            "Exercício demonstrativo. A explicação real poderá ser refinada quando o conteúdo oficial for fornecido.",
          difficulty: moduleIndex === 0 ? "INTRODUCTORY" : "BASIC",
          skillId: skill.id,
          order: 1,
          isDemo: true,
          options: {
            create: [
              {
                text: `A opção que conecta ${moduleTitle} ao objetivo da missão demonstrativa.`,
                isCorrect: true,
                feedback: "Correto. A alternativa mantém coerência com a explicação demonstrativa."
              },
              {
                text: `Uma resposta que mistura ${moduleTitle} com outro assunto sem relação direta.`,
                isCorrect: false,
                feedback: "Ainda não. Revise a explicação mastigada antes de tentar novamente."
              },
              {
                text: "Uma resposta baseada em conteúdo oficial não cadastrado no MVP.",
                isCorrect: false,
                feedback: "O MVP não usa conteúdo oficial inventado. Use apenas o cenário demonstrativo."
              }
            ]
          }
        },
        include: { options: true }
      });

      const challengeExercise = await prisma.exercise.create({
        data: {
          missionId: mission.id,
          type: "MULTIPLE_CHOICE",
          prompt: missionContent.challengePrompt,
          explanation:
            "Desafio demonstrativo sem execução de código. A resposta é validada por alternativa cadastrada.",
          difficulty: "BASIC",
          skillId: skill.id,
          order: 2,
          isDemo: true,
          options: {
            create: [
              {
                text: `Aplicar ${moduleTitle} ao cenário fictício apresentado.`,
                isCorrect: true,
                feedback: "Correto. A decisão segue o cenário fictício e não depende de conteúdo oficial."
              },
              {
                text: "Ignorar o cenário e escolher uma regra externa não cadastrada.",
                isCorrect: false,
                feedback: "Esta plataforma não presume regras externas. Use os dados da missão."
              },
              {
                text: "Executar código no servidor para descobrir a resposta.",
                isCorrect: false,
                feedback: "Não há execução real de código no MVP por segurança."
              }
            ]
          }
        },
        include: { options: true }
      });

      missions.push({
        trackSlug: track.slug,
        moduleSlug,
        missionId: mission.id,
        skillId: skill.id,
        skillSlug: skill.slug,
        exercises: [guidedExercise, challengeExercise].map((exercise) => ({
          id: exercise.id,
          correctOptionId: exercise.options.find((option) => option.isCorrect)?.id ?? exercise.options[0].id,
          wrongOptionId: exercise.options.find((option) => !option.isCorrect)?.id ?? exercise.options[0].id
        }))
      });
    }
  }

  const badges = await Promise.all(
    [
      {
        title: "Primeira Missão",
        slug: "primeira-missao",
        description: "Badge demonstrativa por concluir a primeira missão.",
        icon: "sparkle",
        rule: "Completar uma missão demonstrativa."
      },
      {
        title: "Revisão em Dia",
        slug: "revisao-em-dia",
        description: "Badge demonstrativa por concluir uma revisão.",
        icon: "calendar-check",
        rule: "Finalizar uma revisão pendente."
      },
      {
        title: "Simulado Concluído",
        slug: "simulado-concluido",
        description: "Badge demonstrativa por finalizar um simulado.",
        icon: "clipboard-check",
        rule: "Enviar um simulado básico."
      },
      {
        title: "Consistência",
        slug: "consistencia",
        description: "Badge demonstrativa por manter uma sequência curta de estudo.",
        icon: "flame",
        rule: "Manter streak demonstrativo maior que três."
      },
      {
        title: "Superação",
        slug: "superacao",
        description: "Badge demonstrativa por melhorar em uma habilidade fraca.",
        icon: "trending-up",
        rule: "Melhorar desempenho em assunto marcado como fraco."
      }
    ].map((badge) =>
      prisma.badge.create({
        data: {
          ...badge,
          isDemo: true
        }
      })
    )
  );

  const enrollmentPlan = [
    { student: students[0], trackSlugs: ["redes-de-computadores", "linux-basico", "programacao-do-zero"] },
    { student: students[1], trackSlugs: ["linux-basico", "matematica-para-tecnologia"] },
    { student: students[2], trackSlugs: ["redes-de-computadores", "cyberseguranca-inicial"] },
    { student: students[3], trackSlugs: ["ingles-tecnico", "programacao-do-zero"] },
    { student: students[4], trackSlugs: ["concurso-edital", "matematica-para-tecnologia"] }
  ];

  for (const plan of enrollmentPlan) {
    for (const trackSlug of plan.trackSlugs) {
      const track = tracks.get(trackSlug);
      if (!track) continue;
      await prisma.enrollment.create({
        data: {
          userId: plan.student.id,
          trackId: track.id,
          status: "ACTIVE",
          startedAt: daysFromNow(-8)
        }
      });
    }
  }

  const progressPlan = [
    { student: students[0], completed: 8, inProgress: 3 },
    { student: students[1], completed: 4, inProgress: 2 },
    { student: students[2], completed: 2, inProgress: 2 },
    { student: students[3], completed: 6, inProgress: 1 },
    { student: students[4], completed: 1, inProgress: 1 }
  ];

  for (const plan of progressPlan) {
    const plannedMissions = missions.slice(0, plan.completed + plan.inProgress);

    for (const [index, mission] of plannedMissions.entries()) {
      const completed = index < plan.completed;
      await prisma.missionProgress.create({
        data: {
          userId: plan.student.id,
          missionId: mission.missionId,
          status: completed ? "COMPLETED" : "IN_PROGRESS",
          masteryStatus: completed ? (index % 3 === 0 ? "MASTERED" : "PROFICIENT") : "IN_PROGRESS",
          completedAt: completed ? daysFromNow(-Math.max(1, plan.completed - index)) : null,
          lastStudiedAt: daysFromNow(-Math.max(0, plan.completed - index)),
          attemptsCount: completed ? 2 : 1,
          correctCount: completed ? 2 : 0
        }
      });

      await prisma.userSkillProgress.upsert({
        where: {
          userId_skillId: {
            userId: plan.student.id,
            skillId: mission.skillId
          }
        },
        update: {
          masteryStatus: completed ? "PROFICIENT" : "IN_PROGRESS",
          score: completed ? 80 : 35,
          lastPracticedAt: daysFromNow(-1)
        },
        create: {
          userId: plan.student.id,
          skillId: mission.skillId,
          masteryStatus: completed ? "PROFICIENT" : "IN_PROGRESS",
          score: completed ? 80 : 35,
          lastPracticedAt: daysFromNow(-1)
        }
      });

      for (const [exerciseIndex, exercise] of mission.exercises.entries()) {
        const correct = completed || exerciseIndex === 0;
        const selectedOptionId = correct ? exercise.correctOptionId : exercise.wrongOptionId;
        await prisma.exerciseAttempt.create({
          data: {
            userId: plan.student.id,
            exerciseId: exercise.id,
            selectedOptionId,
            isCorrect: correct,
            feedback: correct
              ? "Tentativa correta criada pelo seed demonstrativo."
              : "Tentativa incorreta criada pelo seed demonstrativo."
          }
        });
      }

      if (completed) {
        await prisma.xPTransaction.create({
          data: {
            userId: plan.student.id,
            amount: 60,
            reason: "MISSION_COMPLETED",
            referenceType: "MISSION",
            referenceId: mission.missionId,
            dedupeKey: buildXpDedupeKey(plan.student.id, "MISSION_COMPLETED", mission.missionId)
          }
        });
      }
    }
  }

  await prisma.userBadge.createMany({
    data: [
      { userId: students[0].id, badgeId: badges[0].id, earnedAt: daysFromNow(-7) },
      { userId: students[0].id, badgeId: badges[2].id, earnedAt: daysFromNow(-2) },
      { userId: students[0].id, badgeId: badges[3].id, earnedAt: daysFromNow(-1) },
      { userId: students[1].id, badgeId: badges[0].id, earnedAt: daysFromNow(-4) },
      { userId: students[3].id, badgeId: badges[0].id, earnedAt: daysFromNow(-5) },
      { userId: students[3].id, badgeId: badges[3].id, earnedAt: daysFromNow(-1) }
    ]
  });

  await prisma.reviewSchedule.createMany({
    data: [
      {
        userId: students[0].id,
        missionId: missions[1].missionId,
        skillId: missions[1].skillId,
        dueAt: daysFromNow(1),
        intervalDays: 1,
        status: "PENDING"
      },
      {
        userId: students[0].id,
        missionId: missions[2].missionId,
        skillId: missions[2].skillId,
        dueAt: daysFromNow(-1),
        intervalDays: 3,
        status: "OVERDUE"
      },
      {
        userId: students[1].id,
        missionId: missions[3].missionId,
        skillId: missions[3].skillId,
        dueAt: daysFromNow(2),
        intervalDays: 1,
        status: "PENDING"
      },
      {
        userId: students[2].id,
        missionId: missions[4].missionId,
        skillId: missions[4].skillId,
        dueAt: daysFromNow(-4),
        intervalDays: 7,
        status: "OVERDUE"
      },
      {
        userId: students[3].id,
        missionId: missions[5].missionId,
        skillId: missions[5].skillId,
        dueAt: daysFromNow(-2),
        intervalDays: 3,
        status: "DONE",
        completedAt: daysFromNow(-1)
      }
    ]
  });

  const simulationDefinitions = [
    {
      title: "Simulado demonstrativo de Redes",
      description: "Simulado fictício e não oficial para validar resultado por habilidade.",
      type: "TRACK" as const,
      trackSlug: "redes-de-computadores",
      exercises: missions
        .filter((mission) => mission.trackSlug === "redes-de-computadores")
        .flatMap((mission) => mission.exercises)
        .slice(0, 6)
    },
    {
      title: "Simulado demonstrativo misto",
      description: "Simulado fictício com assuntos variados para o MVP.",
      type: "MIXED" as const,
      trackSlug: undefined,
      exercises: missions.flatMap((mission) => mission.exercises).slice(0, 8)
    },
    {
      title: "Simulado demonstrativo Concurso/Edital",
      description: "Estrutura genérica para edital. Não contém conteúdo real de concurso.",
      type: "DEMO_EXAM" as const,
      trackSlug: "concurso-edital",
      exercises: missions
        .filter((mission) => mission.trackSlug === "concurso-edital")
        .flatMap((mission) => mission.exercises)
        .slice(0, 6)
    }
  ];

  const createdSimulations = [];
  for (const simulationDefinition of simulationDefinitions) {
    const track = simulationDefinition.trackSlug ? tracks.get(simulationDefinition.trackSlug) : undefined;
    const simulation = await prisma.simulation.create({
      data: {
        title: simulationDefinition.title,
        description: simulationDefinition.description,
        type: simulationDefinition.type,
        trackId: track?.id,
        isDemo: true,
        questions: {
          create: simulationDefinition.exercises.map((exercise, index) => ({
            exerciseId: exercise.id,
            order: index + 1
          }))
        }
      }
    });
    createdSimulations.push({ simulation, exercises: simulationDefinition.exercises });
  }

  const firstSimulation = createdSimulations[0];
  const firstSimulationAnswers = firstSimulation.exercises.map((exercise, index) => {
    const mission = missions.find((item) => item.exercises.some((missionExercise) => missionExercise.id === exercise.id));
    return {
      exercise,
      skillSlug: mission?.skillSlug ?? "habilidade-demonstrativa",
      isCorrect: index < 4
    };
  });
  const simulationResult = calculateSimulationResult(firstSimulationAnswers);

  const simulationAttempt = await prisma.simulationAttempt.create({
    data: {
      userId: students[0].id,
      simulationId: firstSimulation.simulation.id,
      startedAt: daysFromNow(-2),
      finishedAt: daysFromNow(-2),
      score: simulationResult.score,
      correctCount: simulationResult.correctCount,
      wrongCount: simulationResult.wrongCount,
      strongSkillsJson: simulationResult.strongSkills,
      weakSkillsJson: simulationResult.weakSkills
    }
  });

  await prisma.simulationAnswer.createMany({
    data: firstSimulationAnswers.map((answer) => ({
      attemptId: simulationAttempt.id,
      exerciseId: answer.exercise.id,
      selectedOptionId: answer.isCorrect ? answer.exercise.correctOptionId : answer.exercise.wrongOptionId,
      isCorrect: answer.isCorrect
    }))
  });

  await prisma.engagementSignal.createMany({
    data: [
      {
        userId: students[0].id,
        classGroupId: classGroup.id,
        type: "OVERDUE_REVIEWS",
        severity: "ATTENTION",
        message: "Aluno com revisão demonstrativa atrasada.",
        suggestedAction: "Recomendar revisão curta antes da próxima missão."
      },
      {
        userId: students[2].id,
        classGroupId: classGroup.id,
        type: "INACTIVE",
        severity: "ATTENTION",
        message: "Aluno sem acesso recente no ambiente demonstrativo.",
        suggestedAction: "Chamar para monitoria ou indicar missão mastigada."
      },
      {
        userId: students[4].id,
        classGroupId: classGroup.id,
        type: "ABANDONED_TRACK",
        severity: "HIGH_RISK",
        message: "Trilha iniciada e sem continuidade no seed demonstrativo.",
        suggestedAction: "Recomendar trilha de fundamentos e simplificar o desafio."
      },
      {
        userId: students[3].id,
        classGroupId: classGroup.id,
        type: "MISSING_SIMULATION",
        severity: "NORMAL",
        message: "Aluno ainda não fez simulado diagnóstico demonstrativo.",
        suggestedAction: "Indicar simulado básico quando concluir mais uma missão."
      }
    ]
  });

  await prisma.teacherNote.create({
    data: {
      teacherId: teacher.id,
      studentId: students[2].id,
      note: "Observação fictícia: sugerir revisão guiada de fundamentos antes de avançar."
    }
  });

  const exam = await prisma.exam.create({
    data: {
      title: "Edital demonstrativo genérico",
      description: "Estrutura fictícia para validar cadastro de edital. Não representa edital real.",
      organization: "Organização fictícia",
      isDemo: true,
      subjects: {
        create: [
          {
            title: "Disciplina demonstrativa",
            order: 1,
            topics: {
              create: [
                { title: "Assunto demonstrativo", order: 1 },
                { title: "Questões demonstrativas", order: 2 }
              ]
            }
          }
        ]
      }
    }
  });

  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: "SEED_ADMIN_CREATED",
        entityType: "USER",
        entityId: admin.id
      },
      {
        userId: teacher.id,
        action: "SEED_CLASS_READY",
        entityType: "CLASS_GROUP",
        entityId: classGroup.id
      },
      {
        userId: students[0].id,
        action: "SEED_SIMULATION_ATTEMPT",
        entityType: "SIMULATION",
        entityId: firstSimulation.simulation.id
      },
      {
        userId: admin.id,
        action: "SEED_EXAM_STRUCTURE",
        entityType: "EXAM",
        entityId: exam.id
      }
    ]
  });

  console.log("Seed demonstrativo concluído.");
  console.log("Usuários locais: admin@suportif.dev, professor@suportif.dev, aluno@suportif.dev");
  console.log(`Senha local: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
