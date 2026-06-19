import { ModuleNode } from "@/components/tracks/module-node";
import { MissionCard } from "@/components/tracks/mission-card";

type TrackMapProps = {
  modules: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    progressPercent: number;
    completedMissions: number;
    totalMissions: number;
    missions: Array<{
      id: string;
      title: string;
      shortDescription: string;
      masteryStatus: string;
      completed: boolean;
      attemptsCount: number;
      correctCount: number;
      exerciseCount: number;
    }>;
  }>;
};

export function TrackMap({ modules }: TrackMapProps) {
  return (
    <div className="space-y-6">
      {modules.map((module) => (
        <ModuleNode
          key={module.id}
          id={module.id}
          title={module.title}
          description={module.description}
          order={module.order}
          progressPercent={module.progressPercent}
          completedMissions={module.completedMissions}
          totalMissions={module.totalMissions}
        >
          {module.missions.map((mission) => (
            <MissionCard
              key={mission.id}
              id={mission.id}
              title={mission.title}
              description={mission.shortDescription}
              masteryStatus={mission.masteryStatus}
              completed={mission.completed}
              attemptsCount={mission.attemptsCount}
              correctCount={mission.correctCount}
              exerciseCount={mission.exerciseCount}
            />
          ))}
        </ModuleNode>
      ))}
    </div>
  );
}
