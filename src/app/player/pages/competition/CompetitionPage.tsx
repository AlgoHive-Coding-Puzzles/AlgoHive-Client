import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";

import UsersListCompetitions from "@shared/components/UsersListCompetitions";
import AnimatedContainer from "@shared/components/AnimatedContainer";
import CirclePattern from "@shared/components/CirclePattern";
import Navbar from "@shared/components/Navbar";
import Footer from "@shared/components/Footer";

import CompetitionHeader from "./components/CompetitionHeader";
import PuzzleGrid from "./components/PuzzleGrid";

import { ServiceManager } from "@services/index";
import { useAuth } from "@contexts/AuthContext";

import { Competition, Theme, Try } from "@/models";

import "./CompetitionPage.css";

/**
 * CompetitionPage - Main page for viewing competition details and puzzles
 *
 * This component manages the state and data fetching for competitions,
 * with puzzle selection and user progress tracking
 */
export default function CompetitionPage() {
  const { user } = useAuth();
  const { competition_id } = useParams();
  const competitionId = competition_id || "";

  // State management
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [finishedTries, setFinishedTries] = useState<Try[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Fetch competition data by ID
   */
  const fetchCompetition = useCallback(async () => {
    if (!competitionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const competition = await ServiceManager.competitions.fetchByID(
        competitionId
      );
      setSelectedCompetition(competition || null);
    } catch (error) {
      console.error("Error fetching competition:", error);
    } finally {
      setLoading(false);
    }
  }, [competitionId]);

  /**
   * Fetch competition theme and user tries
   */
  const fetchCompetitionDetails = useCallback(async () => {
    if (!selectedCompetition || !user) return;

    try {
      setLoading(true);

      // Fetch theme details and user tries in parallel
      const [themeDetails, triesDetails] = await Promise.all([
        ServiceManager.catalogs.fetchCatalogThemeDetails(
          selectedCompetition.catalog_id,
          selectedCompetition.catalog_theme
        ),
        ServiceManager.competitions.fetchTriesByUserID(
          selectedCompetition.id,
          user.id
        ),
      ]);

      setTheme(themeDetails);

      // Sort and filter tries
      const sortedAndFilteredTries = triesDetails
        .sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        )
        .filter((tryItem) => tryItem.end_time);

      setFinishedTries(sortedAndFilteredTries);
    } catch (error) {
      console.error("Error fetching competition details:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCompetition, user]);

  // Initial competition fetch
  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  // Fetch theme and tries when competition or user changes
  useEffect(() => {
    if (selectedCompetition && user) {
      fetchCompetitionDetails();
    }
  }, [selectedCompetition, user, fetchCompetitionDetails]);

  return (
    <>
      <Tooltip target=".unlocked-card" />
      <section>
        <AnimatedContainer
          visibleClass="!slide-in-from-top-0"
          className="relative"
        >
          <div className="bg-main-gradient h-[51.5rem] absolute top-0 inset-x-0"></div>
          <div className="container relative">
            <div className="h-[46rem] absolute top-0 left-4 right-4">
              <div className="absolute inset-0 overflow-hidden lg:block hidden">
                <CirclePattern className="absolute w-[82rem] -bottom-full translate-y-24 left-1/2 -translate-x-1/2 -z-20" />
              </div>
            </div>
            <div className="relative z-20">
              <Navbar />

              {selectedCompetition ? (
                <>
                  {/* Competition header with title and navigation */}
                  <CompetitionHeader competition={selectedCompetition} />

                  {/* Puzzle grid */}
                  <div className={`lg:mt-28 mt-24`}>
                    {theme && (
                      <PuzzleGrid
                        theme={theme}
                        finishedTries={finishedTries}
                        competitionId={selectedCompetition.id}
                      />
                    )}
                  </div>
                </>
              ) : (
                /* If no competition is selected, show the competitions list */
                !loading && (
                  <div className="mt-16">
                    <UsersListCompetitions
                      setCompetition={setSelectedCompetition}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </AnimatedContainer>

        <div className="mt-20">
          <Footer />
        </div>
      </section>
    </>
  );
}
