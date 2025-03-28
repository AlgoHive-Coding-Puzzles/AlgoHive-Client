import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useRef, useCallback, memo, useEffect } from "react";
import useIsMobile from "../../lib/hooks/use-is-mobile";
import { Competition } from "../../models/Competition";
import { Puzzle } from "../../models/Catalogs";
import { submitPuzzleAnswer } from "../../services/competitionsService";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { useTranslation } from "react-i18next";

const getSecondsToPretty = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

interface InputAnswerProps {
  competition: Competition;
  puzzle: Puzzle;
  puzzle_index: number;
  step: 1 | 2;
  setRefresh: (refreshValue: string) => void;
  disabled?: boolean;
}

function InputAnswer({
  competition,
  puzzle,
  puzzle_index,
  step,
  setRefresh,
  disabled,
}: InputAnswerProps) {
  const isMobile = useIsMobile();
  const [solution, setSolution] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number>();
  const toast = useRef<Toast>(null);
  const { t } = useTranslation();

  // Update cooldown timer
  useEffect(() => {
    if (!cooldown) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev && prev > 1) return prev - 1;
        return undefined;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle input change
  const handleChange = useCallback((e: InputNumberChangeEvent) => {
    setSolution(e.value as number);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (solution === undefined || solution === null) {
      toast.current?.show({
        severity: "error",
        summary: t("puzzles.input.error"),
        detail: t("puzzles.input.solution"),
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await submitPuzzleAnswer(
        competition.id,
        puzzle.id,
        puzzle_index,
        puzzle.difficulty,
        solution,
        step
      );

      if (response.error && response.wait_time_seconds) {
        console.log(
          "Rate limit exceeded. Please wait:",
          response.wait_time_seconds
        );

        setCooldown(response.wait_time_seconds);
        toast.current?.show({
          severity: "warn",
          summary: t("puzzles.input.rateLimited"),
          detail: t("puzzles.input.pleaseWait"),
          life: 3000,
        });
        return;
      }

      if (response.is_correct) {
        toast.current?.show({
          severity: "success",
          summary: t("puzzles.input.correct"),
          detail: t("puzzles.input.congratulations"),
          life: 3000,
        });
        // Delay the refresh to allow toast to be visible
        setTimeout(() => {
          setRefresh(Date.now().toString());
        }, 1000);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: t("puzzles.input.incorrect"),
          detail: t("puzzles.input.tryAgain"),
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: t("puzzles.input.failed"),
        detail: t("puzzles.input.error"),
        life: 3000,
      });
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  }, [
    competition.id,
    puzzle.id,
    puzzle_index,
    puzzle.difficulty,
    solution,
    step,
    setRefresh,
    t,
  ]);

  // Handle keyboard submission
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleSubmit();
      }
    },
    [handleSubmit, loading]
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="p-inputgroup flex-1">
        {!isMobile && (
          <span className="p-inputgroup-addon">
            <i className="pi pi-question-circle mr-2"></i>{" "}
            {t("puzzles.input.answer")}:
          </span>
        )}
        <InputNumber
          placeholder={t("puzzles.input.enterAnswer")}
          className="w-full max-w-md mx-auto"
          value={solution}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading || disabled || !!cooldown}
          aria-label={t("puzzles.input.answer")}
        />
        <Button
          label={t("puzzles.input.submit")}
          className="max-w-md mx-auto"
          onClick={handleSubmit}
          icon={loading ? "pi pi-spinner pi-spin" : "pi pi-check"}
          size="small"
          style={{
            backgroundColor: "#121212",
            color: "#fff",
            border: "0.8px solid #fff",
          }}
          disabled={loading || disabled || !!cooldown}
          aria-label={t("puzzles.input.submit")}
        />
      </div>
      {cooldown && (
        <div className="text-yellow-500 mt-2">
          {t("puzzles.input.cooldownMessage", {
            time: getSecondsToPretty(cooldown),
          })}
        </div>
      )}
    </>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(InputAnswer);
