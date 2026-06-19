import { LoadingState } from "@/components/common/loading-state";

export default function SimulationLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <LoadingState label="Carregando simulado..." />
    </main>
  );
}
