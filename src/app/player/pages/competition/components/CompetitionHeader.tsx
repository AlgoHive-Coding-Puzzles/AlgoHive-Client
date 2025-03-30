import { useTranslation } from "react-i18next";

import OrangeBlackButton from "@shared/components/ui/button";

import { Competition } from "@/models";

interface CompetitionHeaderProps {
  competition: Competition;
}

/**
 * CompetitionHeader - Displays the title, description and navigation buttons
 * for a competition
 */
export default function CompetitionHeader({
  competition,
}: CompetitionHeaderProps) {
  const { t } = useTranslation(["common", "puzzles"]);

  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-20">
        <h1 className="max-w-[calc(100%-3rem)] lg:max-w-5xl mx-auto title lg:text-6xl text-4xl text-center font-bold">
          {competition.title}
        </h1>
      </div>

      <div className="w-32 h-1 bg-orange-500 mx-auto mt-4" />

      <p className="text-center text-2xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
        {competition.description}
      </p>

      <p className="text-center text-xl text-surface-950 dark:text-surface-0 font-semibold mt-10">
        {t("puzzles:selectPuzzle")}
      </p>

      <div className="w-full flex flex-col sm:flex-row justify-center mt-10 gap-6">
        <OrangeBlackButton
          onClickAction={() => {
            window.location.href = "/competitions";
          }}
          text={t("puzzles:backToCompetitions")}
          icon="pi-arrow-left"
        />
        <OrangeBlackButton
          onClickAction={() => {
            window.location.href = `/competition/${competition.id}/leaderboard`;
          }}
          text={t("puzzles:leaderboard")}
          icon="pi-users"
        />
      </div>
    </>
  );
}
