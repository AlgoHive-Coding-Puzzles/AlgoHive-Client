import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

import { User } from "@/models";

interface ParticipantsTableProps {
  participants: User[];
  onViewTries: (user: User) => void;
}

/**
 * ParticipantsTable - Displays a list of competition participants
 *
 * Shows participants with their details and actions to view their tries
 */
export default function ParticipantsTable({
  participants,
  onViewTries,
}: ParticipantsTableProps) {
  const { t } = useTranslation(["common", "staffTabs"]);

  if (participants.length === 0) {
    return (
      <Message
        severity="info"
        text={t("admin:competitions:statistics.noParticipants")}
      />
    );
  }

  /**
   * Action column template with a button to view user tries
   */
  const actionsTemplate = (user: User) => (
    <Button
      icon="pi pi-list"
      label={t("admin:competitions:tries.viewTries")}
      className="p-button-sm p-button-outlined"
      onClick={() => onViewTries(user)}
    />
  );

  return (
    <DataTable
      value={participants}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      tableStyle={{ minWidth: "50rem" }}
      sortField="first_name"
      sortOrder={1}
      emptyMessage={t("admin:competitions:statistics.noParticipants")}
      stripedRows
      resizableColumns
      columnResizeMode="fit"
      showGridlines
    >
      <Column
        field="first_name"
        header={t("common:fields.firstName")}
        sortable
        style={{ width: "25%" }}
      />
      <Column
        field="last_name"
        header={t("common:fields.lastName")}
        sortable
        style={{ width: "25%" }}
      />
      <Column
        field="email"
        header={t("common:fields.email")}
        sortable
        style={{ width: "35%" }}
      />
      <Column
        header={t("common:fields.actions")}
        body={actionsTemplate}
        style={{ width: "15%" }}
        exportable={false}
      />
    </DataTable>
  );
}
