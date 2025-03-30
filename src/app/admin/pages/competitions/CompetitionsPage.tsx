import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ProgressSpinner } from "primereact/progressspinner";

import CompetitionsList from "@admin/pages/competitions/components/CompetitionsList";
import CompetitionForm from "@admin/pages/competitions/components/CompetitionForm";
import CompetitionDetails from "@admin/pages/competitions/components/CompetitionDetails";

import { ServiceManager } from "@/services";

import { Competition } from "@/models";

import "./CompetitionsPage.css";

/**
 * CompetitionsPage - Admin page that manages competitions
 *
 * This component handles:
 * - Listing all competitions
 * - Creating new competitions
 * - Editing existing competitions
 * - Viewing competition details
 */
export default function CompetitionsPage() {
  const { t } = useTranslation(["common", "staffTabs"]);
  const toast = useRef<Toast>(null);

  // State variables
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Dialog visibility states
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
  const [createDialogVisible, setCreateDialogVisible] =
    useState<boolean>(false);
  const [detailsDialogVisible, setDetailsDialogVisible] =
    useState<boolean>(false);

  /**
   * Fetches all competitions from the API
   * Memoized with useCallback to prevent unnecessary re-renders
   */
  const fetchCompetitionsData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedCompetitions = await ServiceManager.competitions.fetchAll();
      setCompetitions(fetchedCompetitions);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", t("common:states.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load competitions on component mount
  useEffect(() => {
    fetchCompetitionsData();
  }, [fetchCompetitionsData]);

  /**
   * Display a toast notification
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

  // Dialog handlers
  const openCreateDialog = () => {
    setSelectedCompetition(null);
    setCreateDialogVisible(true);
  };

  const openEditDialog = (competition: Competition) => {
    setSelectedCompetition(competition);
    setEditDialogVisible(true);
  };

  const openDetailsDialog = (competition: Competition) => {
    setSelectedCompetition(competition);
    setDetailsDialogVisible(true);
  };

  /**
   * Handle successful form submission (create/edit)
   * Refreshes the competitions list automatically
   */
  const handleFormSubmitSuccess = () => {
    // Close all dialog forms
    setCreateDialogVisible(false);
    setEditDialogVisible(false);
    fetchCompetitionsData();
  };

  /**
   * Renders the appropriate content based on loading state and data availability
   */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          <p className="mt-4 text-gray-600">
            {t("admin:competitions:loading")}
          </p>
        </div>
      );
    }

    if (competitions.length === 0) {
      return (
        <Card className="empty-state text-center p-6">
          <div className="flex flex-col items-center">
            <i className="pi pi-flag text-5xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">
              {t("admin:competitions:noCompetitions")}
            </h3>
            <p className="text-gray-500 mb-4">
              {t("admin:competitions:create")} {t("common:states.empty")}
            </p>
            <Button
              label={t("admin:competitions:create")}
              icon="pi pi-plus"
              className="p-button-outlined"
              onClick={openCreateDialog}
            />
          </div>
        </Card>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">
            {t("navigation:dock.competitions")}
          </h1>
          <Button
            label={t("admin:competitions:create")}
            icon="pi pi-plus"
            className="p-button-outlined"
            onClick={openCreateDialog}
          />
        </div>
        <CompetitionsList
          competitions={competitions}
          onEdit={openEditDialog}
          onViewDetails={openDetailsDialog}
        />
      </>
    );
  };

  return (
    <div className="p-4 min-h-screen mb-28">
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Main content */}
      {renderContent()}

      {/* Competition Create Form Dialog - Only render when visible */}
      {createDialogVisible && (
        <CompetitionForm
          visible={createDialogVisible}
          mode="create"
          competition={null}
          onSuccess={handleFormSubmitSuccess}
          onCancel={() => setCreateDialogVisible(false)}
        />
      )}

      {/* Competition Edit Form Dialog - Only render when visible and has selected competition */}
      {editDialogVisible && selectedCompetition && (
        <CompetitionForm
          visible={editDialogVisible}
          mode="edit"
          competition={selectedCompetition}
          onSuccess={handleFormSubmitSuccess}
          onCancel={() => setEditDialogVisible(false)}
        />
      )}

      {/* Competition Details Dialog - Only render when visible and has selected competition */}
      {detailsDialogVisible && selectedCompetition && (
        <CompetitionDetails
          visible={detailsDialogVisible}
          competition={selectedCompetition}
          onClose={() => setDetailsDialogVisible(false)}
          onEdit={() => {
            setDetailsDialogVisible(false);
            openEditDialog(selectedCompetition);
          }}
          onDeleted={() => {
            setDetailsDialogVisible(false);
            fetchCompetitionsData();
          }}
        />
      )}
    </div>
  );
}
