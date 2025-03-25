import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useRef, useCallback, memo } from "react";
import useIsMobile from "../../lib/hooks/use-is-mobile";
import { Competition } from "../../models/Competition";
import { Puzzle } from "../../models/Catalogs";
import { submitPuzzleAnswer } from "../../services/competitionsService";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";

interface InputAnswerProps {
  competition: Competition;
  puzzle: Puzzle;
  puzzle_index: number;
  step: 1 | 2;
  setRefresh: (refreshValue: string) => void;
  refreshValue: string;
  disabled?: boolean;
}

function InputAnswer({
  competition,
  puzzle,
  puzzle_index,
  step,
  setRefresh,
  refreshValue,
  disabled,
}: InputAnswerProps) {
  const isMobile = useIsMobile();
  const [solution, setSolution] = useState<number>();
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  // Handle input change
  const handleChange = useCallback((e: InputNumberChangeEvent) => {
    setSolution(e.value as number);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Input validation
    if (solution === undefined || solution === null) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Solution cannot be empty.",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      // Submit the answer to the API
      const isCorrect = await submitPuzzleAnswer(
        competition.id,
        puzzle.id,
        puzzle_index,
        puzzle.difficulty,
        solution,
        step
      );

      // Show appropriate toast message based on result
      if (isCorrect) {
        toast.current?.show({
          severity: "success",
          summary: "Correct Answer",
          detail: "Congratulations! You found the right answer.",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Incorrect Answer",
          detail: "Try again!",
          life: 3000,
        });
      }

      // Use timestamp + random value to ensure refresh uniqueness
      setRefresh(
        `${refreshValue}_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2)}`
      );
    } catch (error) {
      // Handle submission errors
      toast.current?.show({
        severity: "error",
        summary: "Submission Failed",
        detail: "An error occurred while submitting your answer.",
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
    refreshValue,
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
            <i className="pi pi-question-circle mr-2"></i> Answer:
          </span>
        )}
        <InputNumber
          placeholder="Enter your answer here"
          className="w-full max-w-md mx-auto"
          value={solution}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading || disabled}
          aria-label="Answer input"
        />
        <Button
          label="Submit"
          className="max-w-md mx-auto"
          onClick={handleSubmit}
          icon={loading ? "pi pi-spinner pi-spin" : "pi pi-check"}
          size="small"
          style={{
            backgroundColor: "#121212",
            color: "#fff",
            border: "0.8px solid #fff",
          }}
          disabled={loading || disabled}
          aria-label="Submit answer"
        />
      </div>
    </>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(InputAnswer);
