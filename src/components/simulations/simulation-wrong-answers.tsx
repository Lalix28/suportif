import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SimulationWrongAnswersProps = {
  answers: Array<{
    id: string;
    isCorrect: boolean;
    selectedOption: {
      text: string;
      feedback: string;
    } | null;
    exercise: {
      prompt: string;
      mission: {
        id: string;
        title: string;
        module: {
          title: string;
          track: {
            title: string;
          };
        };
      };
      options: Array<{
        text: string;
        feedback: string;
      }>;
    };
  }>;
};

export function SimulationWrongAnswers({ answers }: SimulationWrongAnswersProps) {
  const wrongAnswers = answers.filter((answer) => !answer.isCorrect);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questões erradas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {wrongAnswers.length > 0 ? (
          wrongAnswers.map((answer) => {
            const correctOption = answer.exercise.options[0];

            return (
              <div key={answer.id} className="rounded-md border bg-white p-4 text-sm leading-6">
                <p className="font-semibold text-slate-950">{answer.exercise.prompt}</p>
                <p className="mt-2 text-slate-600">
                  {answer.exercise.mission.module.track.title} · {answer.exercise.mission.module.title}
                </p>
                <p className="mt-2">
                  Sua resposta: <strong>{answer.selectedOption?.text ?? "Sem resposta"}</strong>
                </p>
                {correctOption ? (
                  <p>
                    Correta: <strong>{correctOption.text}</strong>
                  </p>
                ) : null}
                <p className="mt-2 text-amber-800">{answer.selectedOption?.feedback ?? correctOption?.feedback}</p>
                <Link
                  href={`/app/missoes/${answer.exercise.mission.id}`}
                  className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Revisar missão: {answer.exercise.mission.title}
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-600">Nenhuma questão errada neste resultado.</p>
        )}
      </CardContent>
    </Card>
  );
}
