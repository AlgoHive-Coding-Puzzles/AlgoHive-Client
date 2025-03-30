import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Tooltip } from "primereact/tooltip";

import UsersListCompetitions from "@shared/components/UsersListCompetitions";
import AnimatedContainer from "@shared/components/AnimatedContainer";
import CirclePattern from "@shared/components/CirclePattern";
import OrangeBlackButton from "@shared/components/ui/button";
import Navbar from "@shared/components/Navbar";
import Footer from "@shared/components/Footer";

import { ServiceManager } from "@services/index";

import {
  getPuzzleDifficulty,
  getPuzzleDifficultySeverity,
  isPartDone,
  isPuzzleUnlocked,
  prettyPrintTitle,
} from "@utils/puzzles";

import { useAuth } from "@contexts/AuthContext";

import { Competition, Theme, Try } from "@/models";

import "./CompetitionPage.css";

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

      const competition = await ServiceManager.competitions.fetchByID(
        competitionId
      );
      if (!competition) return;
      setSelectedCompetition(competition);
    };

    fetchCompetitionFromId();
  }, [competitionId]);

  useEffect(() => {
    const getCompetitionDetails = async () => {
      if (!selectedCompetition || !user) return;

      const themeDetails =
        await ServiceManager.catalogs.fetchCatalogThemeDetails(
          selectedCompetition.catalog_id,
          selectedCompetition.catalog_theme
        );
      setTheme(themeDetails);

      const triesDetails = await ServiceManager.competitions.fetchTriesByUserID(
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

                  <div className="w-full flex flex-col sm:flex-row justify-center mt-10 gap-6">
                    <OrangeBlackButton
                      onClickAction={() => {
                        window.location.href = "/competitions";
                      }}
                      text={t("puzzles.backToCompetitions")}
                      icon="pi-arrow-left"
                    />
                    <OrangeBlackButton
                      onClickAction={() => {
                        window.location.href = `/competition/${selectedCompetition.id}/leaderboard`;
                      }}
                      text={t("puzzles.leaderboard")}
                      icon="pi-users"
                    />
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
