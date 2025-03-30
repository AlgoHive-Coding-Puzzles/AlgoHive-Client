import { useTranslation } from "react-i18next";
import { Message } from "primereact/message";

import { CompetitionStatistics } from "@/models";

interface CompetitionStatisticsPanelProps {
  statistics: CompetitionStatistics;
}

/**
 * CompetitionStatisticsPanel - Displays statistics about a competition
 *
 * Shows number metrics like total users, active users, average score, etc.
 */
export default function CompetitionStatisticsPanel({
  statistics,
}: CompetitionStatisticsPanelProps) {
  const { t } = useTranslation(["common", "staffTabs"]);

  if (!statistics) {
    return (
      <Message
        severity="info"
        text={t("admin:competitions:statistics.noData")}
      />
    );
  }

  return (
    <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
      <div className="stat-card bg-blue-50 rounded-lg p-4 shadow-sm">
        <div className="text-lg font-semibold text-blue-800">
          {t("admin:competitions:statistics.totalUsers")}
        </div>
        <div className="text-3xl text-black">{statistics.total_users}</div>
      </div>

      <div className="stat-card bg-green-50 rounded-lg p-4 shadow-sm">
        <div className="text-lg font-semibold text-green-800">
          {t("admin:competitions:statistics.activeUsers")}
        </div>
        <div className="text-3xl text-black">{statistics.active_users}</div>
      </div>

      <div className="stat-card bg-purple-50 rounded-lg p-4 shadow-sm">
        <div className="text-lg font-semibold text-purple-800">
          {t("admin:competitions:statistics.averageScore")}
        </div>
        <div className="text-3xl text-black">
          {statistics.average_score.toFixed(1)}
        </div>
      </div>

      <div className="stat-card bg-red-50 rounded-lg p-4 shadow-sm">
        <div className="text-lg font-semibold text-red-800">
          {t("admin:competitions:statistics.highestScore")}
        </div>
        <div className="text-3xl text-black">
          {statistics.highest_score.toFixed(1)}
        </div>
      </div>

      <div className="stat-card bg-amber-50 rounded-lg p-4 shadow-sm">
        <div className="text-lg font-semibold text-amber-800">
          {t("admin:competitions:statistics.userEngagementRate")}
        </div>
        <div className="text-3xl text-black">
          {statistics.total_users
            ? `${(
                (statistics.active_users / statistics.total_users) *
                100
              ).toFixed(1)}%`
            : "0%"}
        </div>
      </div>
    </div>
  );
}
