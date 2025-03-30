import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";

import { ServiceManager } from "@/services";

import { useAuth } from "@contexts/AuthContext";

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

  const [input, setInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set document title based on quest number
  useEffect(() => {
    document.title = `Copy Input - Quest ${questNumber}`;
  }, [questNumber]);

  // Fetch puzzle data
  useEffect(() => {
    // Skip if any required data is missing
    if (!competitionId || isNaN(questNumber) || !user) {
      return;
    }

    const fetchPuzzleData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        // Fetch competition details
        const competitionData = await ServiceManager.competitions.fetchByID(
          competitionId
        );
        if (!competitionData) {
          setError(`Competition not found: ${competitionId}`);
          return;
        }

        const hasPermission =
          await ServiceManager.competitions.checkPuzzlePermission(
            competitionData.id,
            questNumber - 1
          );

        if (!hasPermission) {
          window.location.href = `/competitions/${competitionId}`;
          return;
        }

        // Fetch puzzle details
        const puzzleData = await ServiceManager.catalogs.fetchPuzzleDetails(
          competitionData.catalog_id,
          competitionData.catalog_theme,
          (questNumber - 1).toString()
        );

        if (!puzzleData) {
          setError(`Puzzle not found for quest ${questNumber}`);
          return;
        }

        // Get puzzle input
        const inputData =
          await ServiceManager.competitions.getCompetitionPuzzleInput(
            competitionData.id,
            puzzleData.difficulty,
            puzzleData.id,
            questNumber - 1
          );

        // Validate input data
        if (!inputData?.input_lines) {
          setError("Invalid puzzle input data");
          return;
        }

        // Process input lines - using newline separator for better readability
        setInput(inputData.input_lines.join("\n"));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          `Failed to fetch data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzleData();
  }, [competitionId, questNumber, user]);

  // Render loading state
  if (loading) {
    return <div className="loading-container">Loading puzzle input...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  // Render puzzle input
  return (
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
}
