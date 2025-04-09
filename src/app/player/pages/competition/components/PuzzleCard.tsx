import { useTranslation } from "react-i18next";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";

import AnimatedContainer from "@shared/components/AnimatedContainer";

import {
  getPuzzleDifficulty,
  getPuzzleDifficultySeverity,
  isPartDone,
  isPuzzleUnlocked,
  prettyPrintTitle,
} from "@utils/puzzles";

import { Puzzle, Try } from "@/models";

interface PuzzleCardProps {
  puzzle: Puzzle;
  index: number;
  finishedTries: Try[];
  competitionId: string;
  delay?: number;
}

/**
 * PuzzleCard - Individual card representing a puzzle in the competition
 *
 * Handles the display and interactive behavior of each puzzle card
 * including unlocking logic, difficulty badges, and completion status
 */
export default function PuzzleCard({
  puzzle,
  index,
  finishedTries,
  competitionId,
  delay = 0,
}: PuzzleCardProps) {
  const { t } = useTranslation(["common", "puzzles"]);

  const unlocked = isPuzzleUnlocked(index, finishedTries.length);

  const handleCardClick = () => {
    if (unlocked) {
      window.location.href = `/competition/${competitionId}/puzzle/${
        index + 1
      }`;
    }
  };

  return (
    <AnimatedContainer
      delay={delay}
      className={`quest-card p-8 border-0 dark:border border-white/12 shadow-stroke dark:shadow-none rounded-4xl bg-[#313131] ${
        unlocked ? "unlocked-card" : "grayscale-card"
      }`}
      data-pr-tooltip={unlocked ? t("puzzles:clickToAccess") : undefined}
      data-pr-position="top"
      onClick={handleCardClick}
    >
      <Badge value={index + 1} className="absolute top-4 right-4" />

      <div className="icon-box ml-0">
        <i className="pi pi-folder" />
      </div>

      <div className="mt-2">
        <Tag
          value={t(
            "puzzles:difficulty." + getPuzzleDifficulty(puzzle.difficulty)
          )}
          // @ts-expect-error Severity is a valid prop but TypeScript doesn't recognize it
          severity={getPuzzleDifficultySeverity(puzzle.difficulty)}
        />

        {/* Part completion status */}
        <div className="flex flex-row gap-2 mt-2">
          <Tag
            value={t("puzzles:partOne")}
            className="flex-1"
            style={{
              backgroundColor: isPartDone(index, 1, finishedTries.length)
                ? "#d8d76d" // Completed color
                : "#9b9ac8", // Not completed color
            }}
          />
          <Tag
            value={t("puzzles:partTwo")}
            className="flex-1"
            style={{
              backgroundColor: isPartDone(index, 2, finishedTries.length)
                ? "#d8d76d" // Completed color
                : "#9b9ac8", // Not completed color
            }}
          />
        </div>
      </div>

      <h5 className="text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
        {prettyPrintTitle(puzzle.title)}
      </h5>
    </AnimatedContainer>
  );
}
