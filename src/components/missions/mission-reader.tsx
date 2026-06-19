import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { ExplanationTabs } from "@/components/missions/explanation-tabs";

type MissionReaderProps = {
  mission: {
    id: string;
    title: string;
    objective: string;
    quickExplanation: string;
    detailedExplanation: string;
    analogy: string;
    practicalExample: string;
    guidedExercisePrompt: string;
    challengePrompt: string;
    summary: string;
    attentionPoints: string[];
    difficulty: string;
    xpReward: number;
    estimatedMinutes: number;
    exercises: Array<{
      id: string;
      order: number;
      prompt: string;
      explanation: string;
      options: Array<{
        id: string;
        text: string;
      }>;
      attempts: Array<{
        id: string;
        isCorrect: boolean;
        feedback: string;
      }>;
    }>;
  };
};

export function MissionReader({ mission }: MissionReaderProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge>{mission.difficulty}</Badge>
            <Badge variant="secondary">{mission.xpReward} XP</Badge>
            <Badge variant="outline">{mission.estimatedMinutes} min</Badge>
          </div>
          <CardTitle className="pt-2 text-3xl">{mission.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-7 text-slate-700">{mission.objective}</p>
        </CardContent>
      </Card>

      <ExplanationTabs
        sections={[
          {
            id: "rapida",
            label: "Rápida",
            content: <p>{mission.quickExplanation}</p>
          },
          {
            id: "mastigada",
            label: "Mastigada",
            content: <p>{mission.detailedExplanation}</p>
          },
          {
            id: "analogia",
            label: "Analogia",
            content: <p>{mission.analogy}</p>
          },
          {
            id: "exemplo",
            label: "Exemplo",
            content: <p>{mission.practicalExample}</p>
          },
          {
            id: "resumo",
            label: "Resumo",
            content: <p>{mission.summary}</p>
          }
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exercício guiado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-700">{mission.guidedExercisePrompt}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desafio sem ajuda</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-slate-700">{mission.challengePrompt}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pontos de atenção</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm leading-6 text-slate-700">
            {mission.attentionPoints.map((point) => (
              <li key={point} className="rounded-md bg-slate-50 px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-950">Exercícios da missão</h2>
        {mission.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            id={exercise.id}
            order={exercise.order}
            prompt={exercise.prompt}
            explanation={exercise.explanation}
            options={exercise.options}
            attempts={exercise.attempts}
          />
        ))}
      </div>
    </div>
  );
}
