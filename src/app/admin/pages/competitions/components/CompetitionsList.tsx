import { useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";

import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import { ServiceManager } from "@/services";

import { Competition } from "@/models";

interface CompetitionsListProps {
  competitions: Competition[];
  onEdit: (competition: Competition) => void;
  onViewDetails: (competition: Competition) => void;
}

/**
 * CompetitionsList - Displays competitions in a data table with filtering and actions
 */
const CompetitionsList = memo(function CompetitionsList({
  competitions,
  onEdit,
  onViewDetails,
}: CompetitionsListProps) {
  const { t } = useTranslation(["common", "staffTabs"]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  /**
   * Download Excel report for a competition
   */
  const downloadExcelReport = useCallback(async (competitionID: string) => {
    try {
      await ServiceManager.competitions.getResumeExportXLSX(competitionID);
    } catch (error) {
      console.error("Error downloading Excel report:", error);
    }
  }, []);

  /**
   * Status template for competition status cells
   */
  const statusTemplate = useCallback(
    (rowData: Competition) => {
      return (
        <div className="flex flex-wrap gap-2">
          {rowData.finished ? (
            <Tag
              severity="warning"
              value={t("admin:competitions:status.finished")}
            />
          ) : (
            <Tag
              severity="success"
              value={t("admin:competitions:status.active")}
            />
          )}

          {rowData.show ? (
            <Tag
              severity="info"
              value={t("admin:competitions:status.visible")}
            />
          ) : (
            <Tag
              severity="danger"
              value={t("admin:competitions:status.hidden")}
            />
          )}
        </div>
      );
    },
    [t]
  );

  /**
   * Actions template for competition action cells
   */
  const actionsTemplate = useCallback(
    (rowData: Competition) => {
      return (
        <div className="flex gap-2 justify-content-center">
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-info p-button-sm"
            onClick={() => onViewDetails(rowData)}
            tooltip={t("common:actions.view")}
          />
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success p-button-sm"
            onClick={() => onEdit(rowData)}
            tooltip={t("common:actions.edit")}
          />
          <Button
            icon="pi pi-download"
            className="p-button-rounded p-button-warning p-button-sm"
            onClick={() => downloadExcelReport(rowData.id)}
            tooltip={t("admin:competitions:actions.downloadReport")}
          />
        </div>
      );
    },
    [onViewDetails, onEdit, downloadExcelReport, t]
  );

  /**
   * Description template for description cells
   */
  const descriptionTemplate = useCallback(
    (rowData: Competition) => (
      <div className="description-cell">{rowData.description}</div>
    ),
    []
  );

  /**
   * Header component for the DataTable
   */
  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{t("admin:competitions:title")}</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" style={{ right: 10 }} />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="p-inputtext-sm"
        />
      </span>
    </div>
  );

  return (
    <Card>
      <DataTable
        value={competitions}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "60rem" }}
        stripedRows
        emptyMessage={t("admin:competitions:noCompetitions")}
        sortField="title"
        sortOrder={1}
        responsiveLayout="scroll"
        globalFilter={globalFilter}
        header={header}
        removableSort
        resizableColumns
        columnResizeMode="fit"
        showGridlines
      >
        <Column
          field="title"
          header={t("admin:competitions:form.title")}
          style={{ width: "20%" }}
          sortable
        />
        <Column
          field="description"
          header={t("admin:competitions:form.description")}
          style={{ width: "30%" }}
          body={descriptionTemplate}
        />
        <Column
          field="catalog_theme"
          header={t("admin:competitions:form.catalogTheme")}
          sortable
          style={{ width: "20%" }}
        />
        <Column
          header={t("common:fields.status")}
          body={statusTemplate}
          style={{ width: "15%" }}
          sortable
          sortField="finished"
        />
        <Column
          header={t("common:fields.actions")}
          body={actionsTemplate}
          style={{ width: "15%" }}
          exportable={false}
        />
      </DataTable>
    </Card>
  );
});

export default CompetitionsList;
