import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from "primereact/tabview";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";

import CompetitionDetailsHeader from "./CompetitionDetailsHeader";
import CompetitionStatisticsPanel from "./CompetitionStatisticsPanel";
import ParticipantsTable from "./ParticipantsTable";
import GroupsTable from "./GroupsTable";
import ParticipantTries from "./ParticipantTries";

import { ServiceManager } from "@/services";
import { Group, User, Competition, CompetitionStatistics } from "@/models";

interface CompetitionDetailsProps {
  visible: boolean;
  competition: Competition;
  onClose: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

/**
 * CompetitionDetails - Dialog component that shows detailed information about a competition
 *
 * This component displays statistics, participants, and groups for a competition
 * and provides actions to edit, toggle visibility, finish, or delete the competition.
 */
export default function CompetitionDetails({
  visible,
  competition,
  onClose,
  onEdit,
  onDeleted,
}: CompetitionDetailsProps) {
  const { t } = useTranslation(["common", "staffTabs"]);
  const toast = useRef<Toast>(null);

  // State
  const [statistics, setStatistics] = useState<CompetitionStatistics | null>(
    null
  );
  const [groups, setGroups] = useState<Group[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [triesDialogVisible, setTriesDialogVisible] = useState<boolean>(false);

  /**
   * Load competition details when the dialog becomes visible
   */
  useEffect(() => {
    if (visible && competition) {
      loadCompetitionDetails();
    }
  }, [visible, competition]);

  /**
   * Load all competition data - statistics, groups, and participants
   */
  const loadCompetitionDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [stats, groupsData, triesData] = await Promise.all([
        ServiceManager.competitions.fetchStatistics(competition.id),
        ServiceManager.competitions.fetchGroups(competition.id),
        ServiceManager.competitions.fetchTries(competition.id),
      ]);

      setStatistics(stats);
      setGroups(groupsData);

      // Extract unique users from tries
      const uniqueUsers = Array.from(
        new Map(
          triesData
            .filter((try_) => try_.user)
            .map((try_) => [try_.user?.id, try_.user])
        ).values()
      );

      setParticipants(
        uniqueUsers.filter((user): user is User => user !== undefined)
      );
    } catch (error) {
      console.error("Error loading competition details:", error);
      showToast("error", t("common:states.errorMessage"));
    } finally {
      setLoading(false);
    }
  }, [competition, t]);

  /**
   * Show a toast notification
   */
  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    detail: string
  ) => {
    toast.current?.show({
      severity,
      summary: t(`common:states.${severity}`),
      detail,
      life: 3000,
    });
  };

  /**
   * Toggle competition visibility
   */
  const handleToggleVisibility = async () => {
    try {
      await ServiceManager.competitions.updateVisibility(
        competition.id,
        !competition.show
      );
      showToast(
        "success",
        t("admin:competitions:messages.toggleVisibilitySuccess")
      );

      // Update competition in parent component
      competition.show = !competition.show;

      // Reload competition details to refresh the view
      await loadCompetitionDetails();
    } catch (error) {
      console.error("Error toggling visibility:", error);
      showToast(
        "error",
        t("admin:competitions:messages.toggleVisibilityError")
      );
    }
  };

  /**
   * Toggle finished status of the competition
   */
  const handleFinishCompetition = async () => {
    try {
      await ServiceManager.competitions.finishCompetition(competition.id);
      showToast("success", t("admin:competitions:messages.finishSuccess"));

      // Update competition in parent component
      competition.finished = !competition.finished;

      // Reload competition details to refresh the view
      await loadCompetitionDetails();
    } catch (error) {
      console.error("Error finishing competition:", error);
      showToast("error", t("admin:competitions:messages.finishError"));
    }
  };

  /**
   * Show delete confirmation dialog
   */
  const confirmDeleteCompetition = () => {
    confirmDialog({
      message: t("admin:competitions:confirmDelete"),
      header: t("admin:competitions:confirmDeleteHeader"),
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await ServiceManager.competitions.remove(competition.id);
          showToast("success", t("admin:competitions:messages.deleteSuccess"));
          onClose();
          onDeleted();
        } catch (error) {
          console.error("Error deleting competition:", error);
          showToast("error", t("admin:competitions:messages.deleteError"));
        }
      },
    });
  };

  /**
   * Opens the participant tries dialog for a specific user
   */
  const viewParticipantTries = (user: User) => {
    setSelectedUser(user);
    setTriesDialogVisible(true);
  };

  return (
    <>
      <Toast ref={toast} />

      <Dialog
        header={t("admin:competitions:details")}
        visible={visible}
        onHide={onClose}
        style={{ width: "70vw", maxWidth: "1200px" }}
        maximizable
        className="competition-details-dialog"
        blockScroll
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center p-6">
            <ProgressSpinner style={{ width: "50px", height: "50px" }} />
            <p className="mt-4 text-gray-600">{t("common:states.loading")}</p>
          </div>
        ) : (
          <>
            {/* Competition header with actions */}
            <CompetitionDetailsHeader
              competition={competition}
              onEdit={onEdit}
              onToggleVisibility={handleToggleVisibility}
              onFinishCompetition={handleFinishCompetition}
              onDelete={confirmDeleteCompetition}
            />

            <div className="competition-description mb-4">
              <p className="text-gray-600">{competition.description}</p>
            </div>

            <Divider />

            {statistics && (
              <TabView>
                {/* Statistics Tab */}
                <TabPanel header={t("admin:competitions:statistics.title")}>
                  <CompetitionStatisticsPanel statistics={statistics} />
                </TabPanel>

                {/* Participants Tab */}
                <TabPanel
                  header={t("admin:competitions:statistics.participants")}
                >
                  <ParticipantsTable
                    participants={participants}
                    onViewTries={viewParticipantTries}
                  />
                </TabPanel>

                {/* Groups Tab */}
                <TabPanel header={t("admin:competitions:statistics.groups")}>
                  <GroupsTable groups={groups} />
                </TabPanel>
              </TabView>
            )}
          </>
        )}
      </Dialog>

      {/* Participant Tries Dialog */}
      {selectedUser && (
        <ParticipantTries
          visible={triesDialogVisible}
          onHide={() => setTriesDialogVisible(false)}
          competitionId={competition.id}
          participant={selectedUser}
        />
      )}
    </>
  );
}
