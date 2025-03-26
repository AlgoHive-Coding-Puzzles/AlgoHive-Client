import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Puzzle } from "../../models/Catalogs";
import { Competition } from "../../models/Competition";
import {
  checkPuzzlePermission,
  fetchCompetitionDetails,
  fetchPuzzleTries,
} from "../../services/competitionsService";
import { fetchPuzzleDetails } from "../../services/catalogsService";
import AnimatedContainer from "../../components/AnimatedContainer";
import Navbar from "../../components/users/Navbar";
import { prettyPrintTitle } from "../../utils/puzzles";
import CirclePattern from "../../components/CirclePattern";
import InputAnswer from "../../components/puzzle/InputAnswer";
import { useAuth } from "../../contexts/AuthContext";
import InputAnswered from "../../components/puzzle/InputAnswered";
import { Try } from "../../models/Try";
import "./puzzle.css";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import BackButton from "../../components/ui/back-button";
import useIsMobile from "../../lib/hooks/use-is-mobile";
import { useTranslation } from "react-i18next";

export default function PuzzlePage() {
  const { user } = useAuth();
  const { puzzle_index, competition_id } = useParams<{
    puzzle_index: string;
    competition_id: string;
  }>();

  const isMobile = useIsMobile();
  const { t } = useTranslation();

  // Derived state with useMemo
  const questNumber = useMemo(
    () => parseInt(puzzle_index || "0") - 1,
    [puzzle_index]
  );
  const competitionId = useMemo(() => competition_id || "", [competition_id]);

  // Component state
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [tries, setTries] = useState<Try[]>([]);
  const [refresh, setRefresh] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputRequesting, setInputRequesting] = useState(false);
  const [pollingForTry, setPollingForTry] = useState(false);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoized derived values
  const firstTry = useMemo(() => tries[0] || null, [tries]);
  const secondTry = useMemo(() => tries[1] || null, [tries]);
  const hasCompletedFirstStep = useMemo(() => !!firstTry?.end_time, [firstTry]);
  const hasCompletedSecondStep = useMemo(
    () => !!secondTry?.end_time,
    [secondTry]
  );

  // Set document title
  useEffect(() => {
    if (puzzle) {
      document.title = `${prettyPrintTitle(puzzle.name)} - AlgoHive`;
    }
  }, [puzzle]);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      if (!competitionId || isNaN(questNumber)) {
        setError("Invalid competition or puzzle identifier");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch competition details
        const competitionData = await fetchCompetitionDetails(competitionId);
        if (!competitionData) {
          setError("Competition not found");
          return;
        }

        const hasPermission = await checkPuzzlePermission(
          competitionData.id,
          questNumber
        );

        if (!hasPermission) {
          window.location.href = `/competitions/${competitionId}`;
          return;
        }

        // Fetch puzzle details
        const puzzleData = await fetchPuzzleDetails(
          competitionData.catalog_id,
          competitionData.catalog_theme,
          questNumber.toString()
        );
        if (!puzzleData) {
          setError("Puzzle not found");
          return;
        }

        // Fetch tries if user is authenticated
        const triesData = user
          ? await fetchPuzzleTries(
              competitionData.id,
              puzzleData.id,
              questNumber
            )
          : [];

        // Sort tries by start time
        const sortedTries = triesData.sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

        // Update state with fetched data
        setCompetition(competitionData);
        setPuzzle(puzzleData);
        setTries(sortedTries);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load puzzle data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [competitionId, questNumber, user, refresh]);

  // Polling function to check for new tries
  const startPollingForNewTry = useCallback(async () => {
    // Stop any existing polling
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }

    setPollingForTry(true);

    // Keep track of the initial try count for comparison
    const initialTryCount = tries.length;

    // Start polling at intervals
    pollingTimerRef.current = setInterval(async () => {
      if (!competitionId || isNaN(questNumber) || !user || !puzzle) return;

      try {
        // Fetch latest tries
        const triesData = await fetchPuzzleTries(
          competitionId,
          puzzle.id,
          questNumber
        );

        // Sort tries by start time
        const sortedTries = triesData.sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

        // If we found new tries, update state and stop polling
        if (sortedTries.length > initialTryCount) {
          setTries(sortedTries);
          setPollingForTry(false);

          if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = null;
          }
        }
      } catch (error) {
        console.error("Error polling for tries:", error);
      }
    }, 1000); // Poll every 2 seconds

    // Safety timeout to stop polling after 30 seconds
    setTimeout(() => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
        setPollingForTry(false);
      }
    }, 30000);
  }, [tries.length, competitionId, questNumber, user, puzzle]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, []);

  // Event handlers with useCallback
  const handleInputRequest = useCallback(() => {
    if (!window) return;

    // Set requesting state to true to show feedback
    setInputRequesting(true);

    const currentUrl = window.location.href;
    const inputUrl = `${currentUrl}/input`;

    const newTab = window.open(inputUrl, "_blank");
    if (newTab) newTab.focus();

    // Start polling for the new Try after a short delay
    // (giving time for the API to create the Try)
    // If the step is 1, we can start polling immediately
    if (!firstTry) {
      setTimeout(() => {
        setInputRequesting(false);
        startPollingForNewTry();
      }, 1000);
    } else {
      setInputRequesting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startPollingForNewTry]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <i className="pi pi-spinner pi-spin text-3xl"></i>
          <p className="mt-2">{t("puzzles.input.loading")}</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <i className="pi pi-exclamation-triangle text-3xl text-yellow-500"></i>
          <p className="mt-2">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Render loading or missing data state
  if (!competition || !puzzle) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <i className="pi pi-spinner pi-spin text-3xl"></i>
        </div>
      </div>
    );
  }

  const GetInputTemplate = () => {
    return (
      <Button
        label={
          inputRequesting
            ? t("puzzles.input.openingInput")
            : pollingForTry
            ? t("puzzles.input.checkingInput")
            : t("puzzles.input.getInput")
        }
        className="w-full max-w-xs"
        onClick={handleInputRequest}
        icon={
          inputRequesting || pollingForTry
            ? "pi pi-spinner pi-spin"
            : "pi pi-download"
        }
        disabled={inputRequesting || pollingForTry}
        size="small"
        style={{
          backgroundColor: "#101018",
          color: "#fff",
          border: "0.8px solid #fff",
        }}
      />
    );
  };

  // Template for input sections
  const InputTemplate = (step: 1 | 2) => {
    const currentStepTry = step === 1 ? firstTry : secondTry;
    const hasRequestedInput = !!currentStepTry;

    return (
      <div className="flex flex-col gap-5 ">
        {GetInputTemplate()}

        {pollingForTry && (
          <div className="text-xs text-center text-blue-300">
            Waiting for your input to be ready...
          </div>
        )}

        {/** Orange line */}
        <div className="w-44 h-1 bg-orange-500 rounded my-4" />

        <div
          className={hasRequestedInput ? "" : "opacity-60 cursor-not-allowed"}
          data-pr-tooltip={
            !hasRequestedInput ? t("puzzles.input.needInput") : undefined
          }
        >
          <Tooltip
            target="[data-pr-tooltip]"
            position="mouse"
            className="bg-surface-950 text-surface-0"
          />
          <InputAnswer
            competition={competition}
            puzzle={puzzle}
            puzzle_index={questNumber}
            step={step}
            setRefresh={setRefresh}
            refreshValue={`step${step}_${Date.now()}`} // Use timestamp for unique refresh value
            disabled={!hasRequestedInput}
          />
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <>
      <section>
        {!isMobile && (
          <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
            <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
          </div>
        )}

        <AnimatedContainer
          visibleClass="!slide-in-from-top-0"
          className="relative"
        >
          <div className="container relative">
            <Navbar />
            <div className="flex flex-col items-center gap-4 mt-20">
              <h1 className="max-w-[calc(100%-3rem)] lg:max-w-5xl mx-auto title lg:text-6xl text-4xl text-center font-bold">
                {prettyPrintTitle(puzzle.name)}
              </h1>
            </div>

            <div className="w-32 h-1 bg-orange-500 mx-auto mt-4" />

            <p className="text-center text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
              {competition.title}
            </p>

            {/* First puzzle step */}
            <div className="puzzle-container mt-20 mb-10">
              <div dangerouslySetInnerHTML={{ __html: puzzle.cipher }}></div>
            </div>

            {hasCompletedFirstStep ? (
              <InputAnswered solution={firstTry.last_answer || ""} />
            ) : (
              InputTemplate(1)
            )}

            {/* Second puzzle step (only shown if first step is completed) */}
            {hasCompletedFirstStep && (
              <>
                <div className="puzzle-container mt-20 mb-10">
                  <div
                    dangerouslySetInnerHTML={{ __html: puzzle.obscure }}
                  ></div>
                </div>
                {hasCompletedSecondStep ? (
                  <InputAnswered solution={secondTry.last_answer || ""} />
                ) : (
                  InputTemplate(2)
                )}
              </>
            )}

            {hasCompletedFirstStep && hasCompletedSecondStep && (
              <>
                <div className="text-lg text-surface-950 dark:text-surface-0 font-semibold mt-10 bg-gradient-to-r from-amber-400 to-red-900 bg-clip-text text-transparent">
                  {t("puzzles.input.bothPartsComplete")}
                </div>

                <div className="text-md text-surface-950 dark:text-surface-0 font-semibold mb-6 mt-2">
                  {t("puzzles.input.canStillAccess")}
                </div>

                {GetInputTemplate()}
              </>
            )}

            <div className="w-full flex justify-start my-20">
              <BackButton
                onClickAction={() =>
                  (window.location.href = `/competitions/${competitionId}`)
                }
                text={t("puzzles.backToCompetition")}
              />
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </>
  );
}
