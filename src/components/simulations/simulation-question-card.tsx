"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SimulationQuestionCardProps = {
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
  selectedOptionId?: string;
  onSelect: (exerciseId: string, optionId: string) => void;
};

export function SimulationQuestionCard({
  order,
  exercise,
  selectedOptionId,
  onSelect
}: SimulationQuestionCardProps) {
  return (
    <Card className={cn(selectedOptionId ? "border-emerald-200" : "border-slate-200")}>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Questão {order}</Badge>
          <Badge variant={selectedOptionId ? "default" : "outline"}>
            {selectedOptionId ? "Respondida" : "Pendente"}
          </Badge>
        </div>
        <CardTitle className="text-lg">{exercise.prompt}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          <p className="font-semibold text-emerald-700">
            {exercise.mission.module.track.title} · {exercise.mission.module.title}
          </p>
          <p className="mt-1">{exercise.explanation}</p>
        </div>
        <input type="hidden" name="exerciseId" value={exercise.id} />
        <div className="grid gap-2">
          {exercise.options.map((option) => {
            const selected = selectedOptionId === option.id;

            return (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border bg-white p-3 text-sm transition-colors",
                  selected ? "border-emerald-500 bg-emerald-50" : "hover:bg-slate-50"
                )}
              >
                <input
                  className="mt-1"
                  type="radio"
                  name={`answer-${exercise.id}`}
                  value={option.id}
                  checked={selected}
                  onChange={() => onSelect(exercise.id, option.id)}
                  required
                />
                <span>{option.text}</span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
