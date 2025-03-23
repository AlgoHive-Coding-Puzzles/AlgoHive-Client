import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Puzzle } from "../../models/Catalogs";
import { Competition } from "../../models/Competition";
import { fetchCompetitionDetails } from "../../services/competitionsService";
import { fetchPuzzleDetails } from "../../services/catalogsService";
import AnimatedContainer from "../../components/AnimatedContainer";
import Navbar from "../../components/users/Navbar";
import { prettyPrintTitle } from "../../utils/puzzles";
import "./puzzle.css";
import { Button } from "primereact/button";
import CirclePattern from "../../components/CirclePattern";
import { InputText } from "primereact/inputtext";

export default function PuzzlePage() {
  // const { t } = useTranslation();
  const { quest_number } = useParams<{ quest_number: string }>();
  const { competition_id } = useParams<{ competition_id: string }>();
  const competitionId = competition_id || "";
  const questNumber = quest_number || "";

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        setLoading(true);
        const competitionData = await fetchCompetitionDetails(competitionId);
        setCompetition(competitionData);
        if (competitionData) {
          console.log("Competition Data:", competitionData);

          const puzzleData = await fetchPuzzleDetails(
            competitionData.catalog_id,
            competitionData.catalog_theme,
            questNumber
          );

          setPuzzle(puzzleData);

          console.log("Puzzle Data:", puzzleData);
        }
      } catch (error) {
        console.error("Error fetching puzzle:", error);
        setError("Failed to fetch puzzle data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzle();
  }, [competitionId, questNumber]);

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
                  onClick={() => console.log("Submit clicked")}
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

                <div className="flex items-center justify-center gap-6 max-w-xl mt-6">
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-question-circle mr-2"></i> Answer:
                    </span>
                    <InputText
                      type="text"
                      placeholder="Enter your answer here"
                      className="w-full max-w-md mx-auto"
                      onChange={(e) => console.log(e.target.value)}
                    />
                    <Button
                      label="Submit"
                      className="max-w-md mx-auto"
                      onClick={() => console.log("Submit clicked")}
                      icon="pi pi-check"
                      size="small"
                      style={{
                        backgroundColor: "#121212",
                        color: "#fff",
                        border: "0.8px solid #fff",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </>
  );
}
