import { useState, useRef, useCallback, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { ServiceManager } from "@/services";
import useIsMobile from "@/lib/hooks/useIsMobile";

import { Competition, Puzzle } from "@/models";

/**
 * Convert seconds to a human-readable format (e.g., "2m 30s")
 */
const getSecondsToPretty = (seconds: number): string => {
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
  is_under_cooldown?: boolean;
  cooldown_remaining_seconds?: number;
}

/**
 * Component for puzzle answer submission
 * Handles solution input, validation, submission, and error/cooldown states
 */
function InputAnswer({
  competition,
  puzzle,
  puzzle_index,
  step,
  setRefresh,
  disabled,
  cooldown_remaining_seconds,
}: InputAnswerProps) {
  const isMobile = useIsMobile();
  const [solution, setSolution] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState<number | undefined>(
    cooldown_remaining_seconds
  );
  const toast = useRef<Toast>(null);
  const { t } = useTranslation(["common", "puzzles"]);

  // Update cooldown timer with cleanup
  useEffect(() => {
    if (!cooldown || cooldown == 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev && prev > 1) return prev - 1;
        return undefined;
      });
    }, 1000);

    // Cleanup interval on unmount or when cooldown ends
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle input change with memoization
  const handleChange = useCallback((e: InputNumberChangeEvent) => {
    setSolution(e.value as number);
  }, []);

  const userUnderCooldown = () => {
    return cooldown !== undefined && cooldown > 0;
  };

  // Handle form submission with proper error handling
  const handleSubmit = useCallback(async () => {
    if (solution === undefined || solution === null) {
      toast.current?.show({
        severity: "error",
        summary: t("puzzles:input.error"),
        detail: t("puzzles:input.solution"),
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await ServiceManager.competitions.trySubmitSolution(
        competition.id,
        puzzle.difficulty,
        puzzle.id,
        puzzle_index,
        solution.toString(),
        step
      );

      console.log("Response from server:", response);

      const didUserJustHitCooldown =
        response.cooldown_remaining_seconds &&
        response.cooldown_remaining_seconds > 0;
      const wasUserUnderCooldown = cooldown && cooldown > 0;

      // Handle rate limiting, if we hit an error or that we already had a cooldown and we are hitting it again
      if (response.error || (didUserJustHitCooldown && wasUserUnderCooldown)) {
        console.log(
          "Rate limit exceeded. Please wait:",
          response.cooldown_remaining_seconds
        );

        toast.current?.show({
          severity: "warn",
          summary: t("puzzles:input.rateLimited"),
          detail: t("puzzles:input.pleaseWait"),
          life: 3000,
        });
        return;
      }

      // Handle correct/incorrect answers
      if (response.is_correct) {
        toast.current?.show({
          severity: "success",
          summary: t("puzzles:input.correct"),
          detail: t("puzzles:input.congratulations"),
          life: 3000,
        });
        // Delay the refresh to allow toast to be visible
        setTimeout(() => {
          setRefresh(Date.now().toString());
        }, 1000);
      } else {
        // If we swapped from notUnderCooldown to underCooldown, we need tweak the toast message
        if (
          didUserJustHitCooldown &&
          !wasUserUnderCooldown &&
          response.cooldown_remaining_seconds
        ) {
          toast.current?.show({
            severity: "warn",
            summary: t("puzzles:input.incorrectRateLimit"),
            detail: t("puzzles:input.incorrectTriggerRateLimit"),
            life: 3000,
          });
        } else {
          toast.current?.show({
            severity: "warn",
            summary: t("puzzles:input.incorrect"),
            detail: t("puzzles:input.tryAgain"),
            life: 3000,
          });
        }
      }

      if (response.is_under_cooldown)
        setCooldown(response.cooldown_remaining_seconds);
    } catch (error) {
      // Improved type checking for error handling
      const axiosError = error as {
        response?: { data?: { wait_time_seconds: number }; status?: number };
      };

      // Handle rate limiting errors (HTTP 429)
      if (
        axiosError?.response?.status === 429 ||
        (error instanceof Error && error.message.includes("429"))
      ) {
        if (axiosError?.response?.data?.wait_time_seconds) {
          setCooldown(axiosError.response.data.wait_time_seconds);
          console.log(
            "Rate limit exceeded. Please wait:",
            axiosError.response.data.wait_time_seconds
          );
        }

        toast.current?.show({
          severity: "warn",
          summary: t("puzzles:input.rateLimited"),
          detail: t("puzzles:input.pleaseWait"),
          life: 3000,
        });
        return;
      }

      // General error handling
      toast.current?.show({
        severity: "error",
        summary: t("puzzles:input.failed"),
        detail: t("puzzles:input.error"),
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

  // Handle keyboard submission (Enter key)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading && !disabled && !cooldown) {
        handleSubmit();
      }
    },
    [handleSubmit, loading, disabled, cooldown]
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="p-inputgroup flex-1">
        {!isMobile && (
          <span className="p-inputgroup-addon">
            <i className="pi pi-question-circle mr-2"></i>{" "}
            {t("puzzles:input.answer")}:
          </span>
        )}
        <InputNumber
          placeholder={t("puzzles:input.enterAnswer")}
          className="w-full max-w-md mx-auto"
          value={solution}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading || disabled || !!cooldown}
          aria-label={t("puzzles:input.answer")}
          max={9999999999999.99}
        />
        <Button
          label={t("puzzles:input.submit")}
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
          aria-label={t("puzzles:input.submit")}
        />
      </div>
      {userUnderCooldown() && (
        <div className="text-yellow-500 mt-2">
          {t("puzzles:input.cooldownMessage", {
            time: getSecondsToPretty(cooldown as number),
          })}
        </div>
      )}
    </>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(InputAnswer);
