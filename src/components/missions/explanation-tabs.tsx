"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type ExplanationTabsProps = {
  sections: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
};

export function ExplanationTabs({ sections }: ExplanationTabsProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const activeSection = sections.find((section) => section.id === activeId) ?? sections[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveId(section.id)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
              activeId === section.id
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {section.label}
          </button>
        ))}
      </div>
      <div className="rounded-lg border bg-white p-5 text-sm leading-7 text-slate-700">
        {activeSection?.content}
      </div>
    </div>
  );
}
