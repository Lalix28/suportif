"use client";

import { useMemo, useState, useActionState } from "react";

import { Button } from "@/components/ui/button";
import { SimulationProgress } from "@/components/simulations/simulation-progress";
import { SimulationQuestionCard } from "@/components/simulations/simulation-question-card";
import {
  submitSimulationAction,
  type SubmitSimulationState
} from "@/server/actions/simulations";

type SimulationFormProps = {
  simulationId: string;
  questions: Array<{
    id: string;
    order: number;
    exercise: {
      id: string;
      prompt: string;
      explanation: string;
      mission: {
        title: string;
        module: {
          title: string;
          track: {
            title: string;
          };
        };
      };
      options: Array<{
        id: string;
        text: string;
      }>;
    };
  }>;
};

const initialState: SubmitSimulationState = {
  status: "idle"
};

export function SimulationForm({ simulationId, questions }: SimulationFormProps) {
  const [state, formAction, isPending] = useActionState(submitSimulationAction, initialState);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question.exercise.id]).length,
    [answers, questions]
  );
  const pendingCount = questions.length - answeredCount;

  function handleSelect(exerciseId: string, optionId: string) {
    setAnswers((current) => ({
      ...current,
      [exerciseId]: optionId
    }));
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="simulationId" value={simulationId} />
      <div className="sticky top-20 z-10 rounded-lg border bg-slate-50/95 p-3 backdrop-blur">
        <SimulationProgress answeredCount={answeredCount} totalCount={questions.length} />
      </div>
      <div className="grid gap-4">
        {questions.map((question) => (
          <SimulationQuestionCard
            key={question.id}
            order={question.order}
            exercise={question.exercise}
            selectedOptionId={answers[question.exercise.id]}
            onSelect={handleSelect}
          />
        ))}
      </div>
      {pendingCount > 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Ainda há {pendingCount} questão(ões) pendente(s). O envio incompleto será recusado.
        </div>
      ) : null}
      {state.status === "error" ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enviando..." : "Enviar simulado"}
        </Button>
        <p className="text-sm text-slate-500">
          O gabarito e feedback aparecem somente depois do envio.
        </p>
      </div>
    </form>
  );
}
