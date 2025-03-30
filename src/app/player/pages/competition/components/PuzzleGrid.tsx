import PuzzleCard from "./PuzzleCard";
import { Theme, Try } from "@/models";

interface PuzzleGridProps {
  theme: Theme;
  finishedTries: Try[];
  competitionId: string;
}

/**
 * PuzzleGrid - Displays a grid of puzzle cards
 *
 * Renders puzzle cards in a responsive grid layout
 */
export default function PuzzleGrid({
  theme,
  finishedTries,
  competitionId,
}: PuzzleGridProps) {
  if (!theme.puzzles || theme.puzzles.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {theme.puzzles.map((puzzle, index) => (
        <PuzzleCard
          key={index}
          index={index}
          puzzle={puzzle}
          finishedTries={finishedTries}
          competitionId={competitionId}
          delay={index * 200}
        />
      ))}
    </div>
  );
}
