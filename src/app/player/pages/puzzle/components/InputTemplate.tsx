import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Tooltip } from "primereact/tooltip";

import GetInputButton from "@player/pages/puzzle/components/GetInputButton";
import InputAnswer from "@player/pages/puzzle/components/InputAnswer";

import { Competition, Puzzle, Try } from "@/models";

interface InputTemplateProps {
  step: 1 | 2;
  firstTry: Try | null;
  secondTry: Try | null;
  inputRequesting: boolean;
  pollingForTry: boolean;
  handleInputRequest: () => void;
  setRefresh: (refreshValue: string) => void;
  competition: Competition;
  puzzle: Puzzle;
  questNumber: number;
}

/**
 * Template for input handling of puzzle steps
 * Manages the flow of requesting input and submitting answers
 */
const InputTemplate = ({
  step,
  firstTry,
  secondTry,
  inputRequesting,
  pollingForTry,
  handleInputRequest,
  setRefresh,
  competition,
  puzzle,
  questNumber,
}: InputTemplateProps) => {
  const { t } = useTranslation(["common", "puzzles"]);

  const currentStepTry = step === 1 ? firstTry : secondTry;
  const hasRequestedInput = !!currentStepTry;

  // Only show polling message when step is 1 (first step) and polling is active
  const showPollingMessage = step === 1 && pollingForTry;

  return (
    <div className="flex flex-col gap-5">
      <GetInputButton
        inputRequesting={inputRequesting}
        pollingForTry={pollingForTry}
        handleInputRequest={handleInputRequest}
      />

      {showPollingMessage && (
        <div className="text-xs text-center text-blue-300">
          {t("puzzles:input.waitingForInput")}
        </div>
      )}

      {/** Orange divider line */}
      <div className="w-44 h-1 bg-orange-500 rounded my-4" />

      <div
        className={hasRequestedInput ? "" : "opacity-60 cursor-not-allowed"}
        data-pr-tooltip={
          !hasRequestedInput ? t("puzzles:input.needInput") : undefined
        }
      >
        <Tooltip
          target="[data-pr-tooltip]"
          position="mouse"
          className="bg-surface-950 text-surface-0"
        />
        <InputAnswer
          competition={competition}
          puzzle={puzzle}
          puzzle_index={questNumber}
          step={step}
          setRefresh={setRefresh}
          disabled={!hasRequestedInput}
        />
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(InputTemplate);
