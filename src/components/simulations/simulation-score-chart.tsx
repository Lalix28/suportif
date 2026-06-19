"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { buildScoreChartData } from "@/lib/simulations/presentation";

type SimulationScoreChartProps = {
  correctCount: number;
  wrongCount: number;
};

export function SimulationScoreChart({ correctCount, wrongCount }: SimulationScoreChartProps) {
  const data = buildScoreChartData(correctCount, wrongCount);

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
