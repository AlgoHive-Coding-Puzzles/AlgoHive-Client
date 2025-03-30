import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";

import { Group } from "@/models";

interface GroupsTableProps {
  groups: Group[];
}

/**
 * GroupsTable - Displays a list of groups associated with a competition
 */
export default function GroupsTable({ groups }: GroupsTableProps) {
  const { t } = useTranslation(["common", "staffTabs"]);

  if (groups.length === 0) {
    return (
      <Message
        severity="info"
        text={t("admin:competitions:statistics.noGroups")}
      />
    );
  }

  return (
    <DataTable
      value={groups}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 25]}
      tableStyle={{ minWidth: "50rem" }}
      sortField="name"
      sortOrder={1}
      emptyMessage={t("admin:competitions:statistics.noGroups")}
      stripedRows
      resizableColumns
      columnResizeMode="fit"
      showGridlines
    >
      <Column
        field="name"
        header={t("common:fields.name")}
        sortable
        style={{ width: "30%" }}
      />
      <Column
        field="description"
        header={t("common:fields.description")}
        style={{ width: "70%" }}
      />
    </DataTable>
  );
}
