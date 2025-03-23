import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCompetitionDetails } from "../../services/competitionsService";
import {
  fetchPuzzleDetails,
  fetchPuzzleInput,
} from "../../services/catalogsService";
import { useAuth } from "../../contexts/AuthContext";

export default function PuzzleInputPage() {
  const { user } = useAuth();

  const { quest_number } = useParams<{ quest_number: string }>();
  const { competition_id } = useParams<{ competition_id: string }>();
  const competitionId = competition_id || "";
  const questNumber = quest_number || "";

  const [input, setInput] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        setLoading(true);
        const competitionData = await fetchCompetitionDetails(competitionId);

        if (competitionData) {
          console.log("Competition Data:", competitionData);

          const puzzleData = await fetchPuzzleDetails(
            competitionData.catalog_id,
            competitionData.catalog_theme,
            questNumber
          );

          if (puzzleData && user) {
            const inputData = await fetchPuzzleInput(
              competitionData.catalog_id,
              competitionData.catalog_theme,
              puzzleData.id,
              user.id
            );

            const inputText = inputData.input_lines.join(" ");
            setInput(inputText);

            const file = new File([inputText], "input");
            const fileUrl = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = "input";
            a.click();
            URL.revokeObjectURL(fileUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (competitionId && questNumber && user) {
      fetchPuzzle();
    }
  }, [competitionId, questNumber, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        fontSize: "12px",
        marginLeft: "10px",
        marginTop: "20px",
      }}
    >
      {input?.split(" ").map((word, index) => (
        <span key={index}>
          {word}
          <br />
        </span>
      ))}
    </div>
  );
}
