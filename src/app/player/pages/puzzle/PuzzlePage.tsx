import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import InputTemplate from "@player/pages/puzzle/components/InputTemplate";
import InputAnswered from "@player/pages/puzzle/components/InputAnswered";
import AnimatedContainer from "@shared/components/AnimatedContainer";
import CirclePattern from "@shared/components/CirclePattern";
import BackButton from "@shared/components/ui/back-button";
import Navbar from "@shared/components/Navbar";

import { ServiceManager } from "@/services";

import { prettyPrintTitle } from "@utils/puzzles";

import { Competition, Puzzle, Try } from "@/models";

import useIsMobile from "@/lib/hooks/useIsMobile";

import { useAuth } from "@contexts/AuthContext";

import "./PuzzlePage.css";

/**
 * Maximum time to poll for tries before giving up
 */
const MAX_POLLING_TIME = 30000; // 30 seconds

/**
 * Polling interval for checking new tries
 */
const POLLING_INTERVAL = 1000; // 1 second

/**
 * PuzzlePage component
 * Handles the display and interaction of puzzle content, including steps, input, and answer submission
 */
export default function PuzzlePage() {
  const { user } = useAuth();
  const { puzzle_index, competition_id } = useParams<{
    puzzle_index: string;
    competition_id: string;
  }>();

  const isMobile = useIsMobile();
  const { t } = useTranslation(["common", "puzzles"]);
  const toast = useRef<Toast | null>(null);

  // Derived state with useMemo to prevent recalculations
  const questNumber = useMemo(
    () => parseInt(puzzle_index || "0") - 1,
    [puzzle_index]
  );
  const competitionId = useMemo(() => competition_id || "", [competition_id]);

  // Component state
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [puzzleMaxIndex, setPuzzleMaxIndex] = useState<number>(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [tries, setTries] = useState<Try[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputRequesting, setInputRequesting] = useState(false);
  const [pollingForTry, setPollingForTry] = useState(false);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Memoized derived values to prevent unnecessary calculations
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
    return () => {
      document.title = "AlgoHive";
    };
  }, [puzzle]);

  /**
   * Fetch all necessary data for the puzzle page
   */
  const fetchPageData = useCallback(async () => {
    if (!competitionId || isNaN(questNumber)) {
      setError("Invalid competition or puzzle identifier");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch competition details
      const competitionData = await ServiceManager.competitions.fetchByID(
        competitionId
      );

      if (!competitionData) {
        setError("Competition not found");
        return;
      }

      const [permissionResponse, themeDetailsResponse] = await Promise.all([
        ServiceManager.competitions.checkPuzzlePermission(
          competitionData.id,
          questNumber
        ),
        ServiceManager.catalogs.fetchCatalogThemeDetails(
          competitionData.catalog_id,
          competitionData.catalog_theme
        ),
      ]);

      if (!permissionResponse.has_permission) {
        window.location.href = `/competitions/${competitionId}`;
        return;
      }

      setPuzzleMaxIndex(themeDetailsResponse.puzzles.length - 1);

      // Fetch puzzle details
      const puzzleData = await ServiceManager.catalogs.fetchPuzzleDetails(
        competitionData.catalog_id,
        competitionData.catalog_theme,
        questNumber.toString()
      );
      if (!puzzleData) {
        setError("Puzzle not found");
        return;
      }

      // Fetch tries if user is authenticated
      let triesData: Try[] = [];
      if (user) {
        triesData = await ServiceManager.competitions.fetchPuzzleTries(
          competitionData.id,
          puzzleData.id,
          questNumber
        );
      }

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
  }, [competitionId, questNumber, user]);

  // Data fetching effect with dependency cleanup
  useEffect(() => {
    fetchPageData();
  }, [fetchPageData, refreshTrigger]);

  /**
   * Start polling for new tries
   * This is only used when the user requests input for the first step
   * and there's currently no first try available
   */
  const startPollingForNewTry = useCallback(() => {
    // Only poll if we're waiting for the first try and it doesn't exist yet
    const shouldPoll = !firstTry;

    // Don't start polling if we don't need to
    if (!shouldPoll) {
      setPollingForTry(false);
      return;
    }

    // Stop any existing polling
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }

    setPollingForTry(true);

    // Keep track of the initial try count for comparison
    const initialTryCount = tries.length;
    const pollStartTime = Date.now();

    // Start polling at intervals
    pollingTimerRef.current = setInterval(async () => {
      if (!competitionId || isNaN(questNumber) || !user || !puzzle) {
        setPollingForTry(false);
        if (pollingTimerRef.current) {
          clearInterval(pollingTimerRef.current);
          pollingTimerRef.current = null;
        }
        return;
      }

      // Timeout safety - stop polling after MAX_POLLING_TIME
      if (Date.now() - pollStartTime > MAX_POLLING_TIME) {
        setPollingForTry(false);
        if (pollingTimerRef.current) {
          clearInterval(pollingTimerRef.current);
          pollingTimerRef.current = null;
        }
        // Show timeout message
        toast.current?.show({
          severity: "warn",
          summary: t("puzzles:input.pollingTimeout"),
          detail: t("puzzles:input.refreshPage"),
          life: 5000,
        });
        return;
      }

      try {
        // Fetch latest tries
        const triesData = await ServiceManager.competitions.fetchPuzzleTries(
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
    }, POLLING_INTERVAL);

    // Safety timeout to stop polling after MAX_POLLING_TIME - handled in the interval check as well
    setTimeout(() => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
        setPollingForTry(false);
      }
    }, MAX_POLLING_TIME + 100); // Add a small buffer
  }, [tries.length, competitionId, questNumber, user, puzzle, t, firstTry]);

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, []);

  /**
   * Handle input request button click
   * Opens a new tab with input page and only starts polling if we're getting the first try
   */
  const handleInputRequest = useCallback(() => {
    if (typeof window === "undefined") return;

    // Set requesting state to true to show feedback
    setInputRequesting(true);

    const currentUrl = window.location.href;
    const inputUrl = `${currentUrl}/input`;

    const newTab = window.open(inputUrl, "_blank");
    if (newTab) newTab.focus();

    // Only start polling if we're waiting for the first try and don't have it yet
    const shouldPoll = !firstTry;

    // Add a short delay to give time for the API to respond
    setTimeout(() => {
      setInputRequesting(false);

      // Only poll if necessary (for first try)
      if (shouldPoll) {
        startPollingForNewTry();
      }
    }, 1000);
  }, [startPollingForNewTry, firstTry]);

  /**
   * Navigate to the next puzzle
   * Used when the user completes both steps of a puzzle
   */
  const navigateToNextPuzzle = useCallback(() => {
    if (!puzzle_index || !competitionId) return;

    const nextPuzzleNumber = parseInt(puzzle_index) + 1;
    window.location.href = `/competition/${competitionId}/puzzle/${nextPuzzleNumber}`;
  }, [puzzle_index, competitionId]);

  /**
   * Navigate back to the competition page
   */
  const navigateToCompetition = useCallback(() => {
    if (!competitionId) return;
    window.location.href = `/competitions/${competitionId}`;
  }, [competitionId]);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <i className="pi pi-spinner pi-spin text-3xl"></i>
          <p className="mt-2">{t("puzzles:input.loading")}</p>
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

  // Main component render
  return (
    <>
      <Toast ref={toast} position="top-right" />

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
              <InputTemplate
                step={1}
                firstTry={firstTry}
                secondTry={secondTry}
                inputRequesting={inputRequesting}
                pollingForTry={pollingForTry}
                handleInputRequest={handleInputRequest}
                setRefresh={setRefreshTrigger}
                competition={competition}
                puzzle={puzzle}
                questNumber={questNumber}
              />
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
                  <InputTemplate
                    step={2}
                    firstTry={firstTry}
                    secondTry={secondTry}
                    inputRequesting={inputRequesting}
                    pollingForTry={pollingForTry}
                    handleInputRequest={handleInputRequest}
                    setRefresh={setRefreshTrigger}
                    competition={competition}
                    puzzle={puzzle}
                    questNumber={questNumber}
                  />
                )}
              </>
            )}

            {/* Both parts complete section */}
            {hasCompletedFirstStep && hasCompletedSecondStep && (
              <>
                <div className="text-lg text-surface-950 dark:text-surface-0 font-semibold mt-10 bg-gradient-to-r from-amber-400 to-red-900 bg-clip-text text-transparent">
                  {t("puzzles:input.bothPartsComplete")}
                </div>

                <div className="text-md text-surface-950 dark:text-surface-0 font-semibold mb-6 mt-2">
                  {t("puzzles:input.canStillAccess")}
                </div>

                {/* Simple GetInputButton with no polling after completion */}
                <Button
                  label={t("puzzles:input.getInput")}
                  className="w-full max-w-xs"
                  onClick={() => {
                    const currentUrl = window.location.href;
                    const inputUrl = `${currentUrl}/input`;
                    window.open(inputUrl, "_blank");
                  }}
                  icon="pi pi-download"
                  size="small"
                  style={{
                    backgroundColor: "#101018",
                    color: "#fff",
                    border: "0.8px solid #fff",
                  }}
                />
              </>
            )}

            {/* Navigation buttons */}
            <div className="w-full flex justify-start my-20 gap-10">
              <BackButton
                onClickAction={navigateToCompetition}
                text={t("puzzles:backToCompetition")}
              />

              {hasCompletedFirstStep &&
                hasCompletedSecondStep &&
                questNumber < puzzleMaxIndex && (
                  <button
                    className="p-[3px] relative"
                    onClick={navigateToNextPuzzle}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg" />
                    <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <span className="relative z-10">
                          {t("puzzles:nextPuzzle")}
                        </span>
                        <i className="pi pi-arrow-right" />
                      </div>
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-200" />
                    </div>
                  </button>
                )}
            </div>
          </div>
        </AnimatedContainer>
      </section>
    </>
  );
}
