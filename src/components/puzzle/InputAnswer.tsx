import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import useIsMobile from "../../lib/hooks/use-is-mobile";
import { Competition } from "../../models/Competition";
import { Puzzle } from "../../models/Catalogs";
import { submitPuzzleAnswer } from "../../services/competitionsService";

interface InputAnswerProps {
  competition: Competition;
  puzzle: Puzzle;
  puzzle_index: number;
  step: 1 | 2;
  setRefresh: (refreshValue: string) => void;
  refreshValue: string;
}

export default function InputAnswer({
  competition,
  puzzle,
  puzzle_index,
  step,
  setRefresh,
  refreshValue,
}: InputAnswerProps) {
  const isMobile = useIsMobile();
  const [solution, setSolution] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!solution) {
        console.error("Solution is empty");
        return;
      }

      const res = await submitPuzzleAnswer(
        competition.id,
        puzzle.id,
        puzzle_index,
        puzzle.difficulty,
        solution,
        step
      );

      console.log("Answer submitted:", res);

      setRefresh(refreshValue);
    } catch (e) {
      console.error("Error submitting answer:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="p-inputgroup flex-1">
      {!isMobile && (
        <span className="p-inputgroup-addon">
          <i className="pi pi-question-circle mr-2"></i> Answer:
        </span>
      )}
      <InputText
        type="text"
        placeholder="Enter your answer here"
        className="w-full max-w-md mx-auto"
        value={solution || ""}
        onChange={(e) => setSolution(e.target.value)}
      />

      <Button
        label="Submit"
        className="max-w-md mx-auto"
        onClick={() => handleSubmit()}
        icon="pi pi-check"
        size="small"
        style={{
          backgroundColor: "#121212",
          color: "#fff",
          border: "0.8px solid #fff",
        }}
      />
    </div>
  );
}
