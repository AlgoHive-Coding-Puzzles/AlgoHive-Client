import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { usePuzzleInput } from "./hooks/usePuzzleInput";

export default function PuzzleInputPage() {
  const { user } = useAuth();
  const { puzzle_index, competition_id } = useParams<{
    puzzle_index: string;
    competition_id: string;
  }>();

  const competitionId = competition_id || "";
  const questNumber = useMemo(
    () => parseInt(puzzle_index || "0"),
    [puzzle_index]
  );

  // Set document title based on quest number
  useEffect(() => {
    document.title = `Copy Input - Quest ${questNumber}`;
  }, [questNumber]);

  // Use the custom hook to fetch puzzle input
  const { input, loading, error } = usePuzzleInput(
    competitionId,
    questNumber,
    user
  );

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Render puzzle input
  return <PuzzleInputDisplay input={input} />;
}

// Component extraction for better readability and maintenance
const LoadingState = () => (
  <div className="loading-container">Loading puzzle input...</div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="error-container">Error: {message}</div>
);

const PuzzleInputDisplay = ({ input }: { input: string | null }) => (
  <div
    className="puzzle-input"
    style={{
      fontSize: "12px",
      marginLeft: "10px",
      marginTop: "20px",
      whiteSpace: "pre-wrap",
    }}
  >
    {input || "No input available"}
  </div>
);
