import { t } from "i18next";

import { Tooltip } from "primereact/tooltip";

import GetInputTemplate from "@player/pages/puzzle/components/GetInputButton";
import InputAnswer from "@player/pages/puzzle/components/InputAnswer";

import { Competition, Puzzle, Try } from "@/models";

interface InputTemplateProps {
  step: 1 | 2;
  firstTry: Try;
  secondTry: Try;
  inputRequesting: boolean;
  pollingForTry: boolean;
  handleInputRequest: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<string>>;
  competition: Competition;
  puzzle: Puzzle;
  questNumber: number;
}

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
  const currentStepTry = step === 1 ? firstTry : secondTry;
  const hasRequestedInput = !!currentStepTry;

  return (
    <div className="flex flex-col gap-5 ">
      <GetInputTemplate
        inputRequesting={inputRequesting}
        pollingForTry={pollingForTry}
        handleInputRequest={handleInputRequest}
      />

      {pollingForTry && (
        <div className="text-xs text-center text-blue-300">
          Waiting for your input to be ready...
        </div>
      )}

      {/** Orange line */}
      <div className="w-44 h-1 bg-orange-500 rounded my-4" />

      <div
        className={hasRequestedInput ? "" : "opacity-60 cursor-not-allowed"}
        data-pr-tooltip={
          !hasRequestedInput ? t("puzzles.input.needInput") : undefined
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

export default InputTemplate;
