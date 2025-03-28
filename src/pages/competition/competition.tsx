import AnimatedContainer from "../../components/AnimatedContainer";
import CirclePattern from "../../components/CirclePattern";
import { Tooltip } from "primereact/tooltip";
import Navbar from "../../components/users/Navbar";
import { useEffect, useState } from "react";
import { Competition } from "../../models/Competition";
import UsersListCompetitions from "../../components/UsersListCompetitions";
import { fetchCatalogThemeDetails } from "../../services/catalogsService";
import { Theme } from "../../models/Catalogs";
import {
  getPuzzleDifficulty,
  getPuzzleDifficultySeverity,
  isPartDone,
  isPuzzleUnlocked,
  prettyPrintTitle,
} from "../../utils/puzzles";
import { Tag } from "primereact/tag";
import { Try } from "../../models/Try";
import {
  fetchCompetitionDetails,
  fetchUserCompetitionTries,
} from "../../services/competitionsService";
import { useAuth } from "../../contexts/AuthContext";
import "./competition.css";
import { Badge } from "primereact/badge";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import BackButton from "../../components/ui/back-button";
import Footer from "../../components/Footer";

export default function CompetitionPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const { competition_id } = useParams();
  const competitionId = competition_id || "";

  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [finishedTries, setFinishedTries] = useState<Try[]>([]);

  useEffect(() => {
    const fetchCompetitionFromId = async () => {
      if (!competitionId || competitionId.length == 0) return;

      const competition = await fetchCompetitionDetails(competitionId);
      if (!competition) return;
      setSelectedCompetition(competition);
    };

    fetchCompetitionFromId();
  }, [competitionId]);

  useEffect(() => {
    const getCompetitionDetails = async () => {
      if (!selectedCompetition || !user) return;

      const themeDetails = await fetchCatalogThemeDetails(
        selectedCompetition.catalog_id,
        selectedCompetition.catalog_theme
      );
      setTheme(themeDetails);

      const triesDetails = await fetchUserCompetitionTries(
        selectedCompetition.id,
        user.id
      );

      const sortedAndFilteredTries = triesDetails
        .sort(
          (a, b) =>
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        )
        .filter((tryItem) => tryItem.end_time);

      setFinishedTries(sortedAndFilteredTries);
    };

    getCompetitionDetails();
  }, [selectedCompetition, user]);

  return (
    <>
      <Tooltip target={".unlocked-card"} />
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
              {selectedCompetition && (
                <>
                  <div className="flex flex-col items-center gap-4 mt-20">
                    <h1 className="max-w-[calc(100%-3rem)] lg:max-w-5xl mx-auto title lg:text-6xl text-4xl text-center font-bold">
                      {selectedCompetition.title}
                    </h1>
                  </div>

                  <div className="w-32 h-1 bg-orange-500 mx-auto mt-4" />

                  <p className="text-center text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
                    {selectedCompetition.description}
                  </p>

                  <p className="text-center text-xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
                    {t("puzzles.selectPuzzle")}
                  </p>

                  <div className="w-full flex justify-center mt-10">
                    <BackButton
                      onClickAction={() => {
                        setSelectedCompetition(null);
                      }}
                      text={t("puzzles.backToCompetitions")}
                    />
                  </div>
                  <div className="w-full flex justify-center mt-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => {
                        window.location.href = `/competition/${selectedCompetition.id}/leaderboard`;
                      }}
                    >
                      View Leaderboard
                    </button>
                  </div>
                  <div className={`lg:mt-28 mt-24`}>
                    {theme && theme.puzzles && (
                      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {theme.puzzles.map((item, index) => (
                          <AnimatedContainer
                            key={index}
                            delay={index * 200}
                            className={
                              `quest-card p-8 border-0 dark:border border-white/12 shadow-stroke dark:shadow-none rounded-4xl bg-[#313131] ` +
                              (isPuzzleUnlocked(index, finishedTries.length)
                                ? "unlocked-card"
                                : "grayscale-card")
                            }
                            data-pr-tooltip={t("puzzles.clickToAccess")}
                            data-pr-position="top"
                            onClick={() => {
                              if (
                                isPuzzleUnlocked(index, finishedTries.length)
                              ) {
                                window.location.href = `/competition/${
                                  selectedCompetition.id
                                }/puzzle/${index + 1}`;
                              }
                            }}
                          >
                            <Badge
                              value={index + 1}
                              className="absolute top-4 right-4"
                            />
                            <div className="icon-box ml-0">
                              <i className="pi pi-folder" />
                            </div>
                            <div className="mt-2">
                              <Tag
                                value={t(
                                  "puzzles.difficulty." +
                                    getPuzzleDifficulty(item.difficulty)
                                )}
                                // @ts-expect-error pls
                                severity={getPuzzleDifficultySeverity(
                                  item.difficulty
                                )}
                              />

                              {/** Two tags in one line */}
                              <div className="flex flex-row gap-2 mt-2">
                                <Tag
                                  value="Part One"
                                  className="flex-1"
                                  style={{
                                    backgroundColor: isPartDone(
                                      index,
                                      1,
                                      finishedTries.length
                                    )
                                      ? "#d8d76d"
                                      : "#9b9ac8",
                                  }}
                                />
                                <Tag
                                  value="Part Two"
                                  className="flex-1"
                                  style={{
                                    backgroundColor: isPartDone(
                                      index,
                                      2,
                                      finishedTries.length
                                    )
                                      ? "#d8d76d"
                                      : "#9b9ac8",
                                  }}
                                />
                              </div>
                            </div>
                            <h5 className="text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
                              {prettyPrintTitle(item.name)}
                            </h5>
                          </AnimatedContainer>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {!selectedCompetition && (
              <div className="mt-16">
                <UsersListCompetitions
                  setCompetition={setSelectedCompetition}
                />
              </div>
            )}
          </div>
        </AnimatedContainer>

        <div className="mt-20">
          <Footer />
        </div>
      </section>
    </>
  );
}
