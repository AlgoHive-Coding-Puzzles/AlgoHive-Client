import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Puzzle } from "../../models/Catalogs";
import { Competition } from "../../models/Competition";
import {
  fetchCompetitionDetails,
  fetchPuzzleTries,
} from "../../services/competitionsService";
import { fetchPuzzleDetails } from "../../services/catalogsService";
import AnimatedContainer from "../../components/AnimatedContainer";
import Navbar from "../../components/users/Navbar";
import { prettyPrintTitle } from "../../utils/puzzles";
import "./puzzle.css";
import { Button } from "primereact/button";
import CirclePattern from "../../components/CirclePattern";
import InputAnswer from "../../components/puzzle/InputAnswer";
import { Try } from "../../models/Try";
import { useAuth } from "../../contexts/AuthContext";

export default function PuzzlePage() {
  // const { t } = useTranslation();
  const { user } = useAuth();

  const { quest_number } = useParams<{ quest_number: string }>();
  const { competition_id } = useParams<{ competition_id: string }>();
  const competitionId = competition_id || "";
  const questNumber = quest_number || "";

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [tries, setTries] = useState<Try[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const _fetchPuzzleDetails = async () => {
      try {
        setLoading(true);

        // Fetch competition details
        const competitionData = await fetchCompetitionDetails(competitionId);
        if (isMounted) setCompetition(competitionData);

        if (competitionData) {
          // Fetch puzzle details
          const puzzleData = await fetchPuzzleDetails(
            competitionData.catalog_id,
            competitionData.catalog_theme,
            questNumber
          );
          if (isMounted) {
            setPuzzle(puzzleData);

            // Fetch user competition tries
            if (user) {
              const triesDetails = await fetchPuzzleTries(
                competitionData.id,
                puzzleData?.id || "",
                parseInt(questNumber)
              );
              setTries(triesDetails);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching puzzle details:", error);
        if (isMounted)
          setError("Failed to fetch puzzle data. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    _fetchPuzzleDetails();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates
    };
  }, [competitionId, questNumber, user]);

  const handleInputRequest = async () => {
    // Redirect to current url and just add /input
    const currentUrl = window.location.href;
    const inputUrl = currentUrl + "/input";

    if (!window || !inputUrl) return;

    // Open a new tab with the input URL
    const newTab = window.open(inputUrl, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!competition || !puzzle) {
    return <div>No competition or puzzle data available.</div>;
  }

  return (
    <>
      <section>
        <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
          <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
        </div>

        <AnimatedContainer
          visibleClass="!slide-in-from-top-0"
          className="relative"
        >
          <div className="bg-main-gradient h-[51.5rem] absolute top-0 inset-x-0"></div>
          <div className="container relative">
            <div className="relative z-20">
              <Navbar />
              <h1 className="max-w-[calc(100%-3rem)] lg:max-w-5xl mx-auto title lg:text-6xl text-4xl text-center mt-18 font-bold">
                {prettyPrintTitle(puzzle.name)}
              </h1>

              <div className="w-32 h-1 bg-orange-500 mx-auto mt-4" />

              <p className="text-center text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
                {competition.title}
              </p>

              <div className="puzzle-container mt-20 mb-10">
                <div dangerouslySetInnerHTML={{ __html: puzzle.cipher }}></div>
              </div>

              <div className="mx-4 flex flex-col gap-5 mb-32">
                <Button
                  label="Get your puzzle input"
                  className="w-full max-w-xs mx-auto"
                  onClick={() => handleInputRequest()}
                  icon="pi pi-download"
                  size="small"
                  style={{
                    backgroundColor: "#101018",
                    color: "#fff",
                    border: "0.8px solid #fff",
                  }}
                />

                {/* Orange Line */}
                <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 ml-0"></div>

                <div className="flex items-center justify-center gap-6 max-w-2xl md:max-w-xl mt-6">
                  <InputAnswer
                    competition={competition}
                    puzzle={puzzle}
                    puzzle_index={parseInt(questNumber)}
                    step={
                      tries.filter((item) => item.end_time).length % 2 === 0
                        ? 1
                        : 2
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </>
  );
}
