export type SkillResultView = {
  key: string;
  label: string;
  correctCount: number;
  wrongCount: number;
  total: number;
  accuracy: number;
};

export type SimulationAttemptView = {
  id?: string;
  score: number;
  finishedAt?: Date | null;
};

export function parseSkillResults(value: unknown): SkillResultView[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is SkillResultView => {
    if (!item || typeof item !== "object") {
      return false;
    }

    const candidate = item as Partial<SkillResultView>;
    return (
      typeof candidate.key === "string" &&
      typeof candidate.label === "string" &&
      typeof candidate.correctCount === "number" &&
      typeof candidate.wrongCount === "number" &&
      typeof candidate.total === "number" &&
      typeof candidate.accuracy === "number"
    );
  });
}

export function getBestSimulationScore(attempts: SimulationAttemptView[]) {
  if (attempts.length === 0) {
    return null;
  }

  return Math.max(...attempts.map((attempt) => attempt.score));
}

export function getSimulationRecommendationStatus(attempts: SimulationAttemptView[]) {
  if (attempts.length === 0) {
    return "Recomendado";
  }

  const bestScore = getBestSimulationScore(attempts) ?? 0;

  if (bestScore < 60) {
    return "Revisar e refazer";
  }

  if (bestScore < 80) {
    return "Bom para praticar";
  }

  return "Consolidado";
}

export function buildScoreChartData(correctCount: number, wrongCount: number) {
  return [
    { name: "Acertos", value: correctCount, fill: "#047857" },
    { name: "Erros", value: wrongCount, fill: "#d97706" }
  ];
}
