import { useState } from "react";
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

export default function CompetitionsList({
  competitions,
  onEdit,
  onViewDetails,
}: CompetitionsListProps) {
  const { t } = useTranslation(["common", "staffTabs"]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const downloadExcelReport = async (competitionID: string) => {
    ServiceManager.competitions.getResumeExportXLSX(competitionID);
  };

  const statusTemplate = (rowData: Competition) => {
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
          <Tag severity="info" value={t("admin:competitions:status.visible")} />
        ) : (
          <Tag
            severity="danger"
            value={t("admin:competitions:status.hidden")}
          />
        )}
      </div>
    );
  };

  const actionsTemplate = (rowData: Competition) => {
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
  };

  const header = (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{t("admin:competitions:title")}</h2>
      <span className="p-input-icon-left">
        <i className="pi pi-search" style={{ right: "10px" }} />
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
      >
        <Column
          field="title"
          header={t("admin:competitions:form.title")}
          style={{ width: "20rem" }}
          sortable
        />
        <Column
          field="description"
          header={t("admin:competitions:form.description")}
          style={{ maxWidth: "100px" }}
          body={(rowData) => (
            <div
              className="description-cell"
              style={{
                maxHeight: "60px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {rowData.description}
            </div>
          )}
        />
        <Column
          field="catalog_theme"
          header={t("admin:competitions:form.catalogTheme")}
          sortable
          style={{ width: "15rem" }}
        />
        <Column
          header={t("common:fields.status")}
          body={statusTemplate}
          style={{ width: "180px" }}
          sortable
          sortField="finished"
        />
        <Column
          header={t("common:fields.actions")}
          body={actionsTemplate}
          style={{ width: "150px", textAlign: "center" }}
        />
      </DataTable>
    </Card>
  );
}
