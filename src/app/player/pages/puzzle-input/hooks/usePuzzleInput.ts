import { useState, useEffect } from "react";
import { ServiceManager } from "@/services";
import { User } from "@/models";

export function usePuzzleInput(
  competitionId: string,
  questNumber: number,
  user: User | null
) {
  const [input, setInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return { input, loading, error };
}
