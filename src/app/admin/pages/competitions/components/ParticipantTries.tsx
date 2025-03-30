import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import { Message } from "primereact/message";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";

import { ServiceManager } from "@/services";

import { User, Try } from "@/models";

interface ParticipantTriesProps {
  visible: boolean;
  onHide: () => void;
  competitionId: string;
  participant: User | null;
}

export default function ParticipantTries({
  visible,
  onHide,
  competitionId,
  participant,
}: ParticipantTriesProps) {
  const { t } = useTranslation(["common", "staffTabs"]);
  const [tries, setTries] = useState<Try[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (visible && competitionId && participant) {
      loadTries();
    }
  }, [visible, competitionId, participant]);

  const loadTries = async () => {
    try {
      setLoading(true);
      const data = await ServiceManager.competitions.fetchTriesByUserID(
        competitionId,
        participant?.id || ""
      );
      setTries(data);
    } catch (error) {
      console.error("Error loading participant tries:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const scoreTemplate = (rowData: Try) => {
    let severity: "success" | "warning" | "danger" | "info" = "info";

    if (rowData.score >= 80) {
      severity = "success";
    } else if (rowData.score >= 50) {
      severity = "warning";
    } else if (rowData.score > 0) {
      severity = "danger";
    }

    return <Tag value={rowData.score.toFixed(1)} severity={severity} />;
  };

  const attemptTemplate = (rowData: Try) => {
    return <Tag value={rowData.attempts.toString()} />;
  };

  const statusTemplate = (rowData: Try) => {
    if (rowData.end_time) {
      return <Tag severity="success" value="Completed" />;
    }
    return <Tag severity="info" value="In Progress" />;
  };

  return (
    <Dialog
      header={t("admin:competitions:statistics.viewTriesFor", {
        name: `${participant?.first_name} ${participant?.last_name}`,
      })}
      visible={visible}
      onHide={onHide}
      style={{ width: "70vw", maxWidth: "1000px" }}
      className="participant-tries-dialog"
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          <p className="mt-4 text-gray-600">
            {t("admin:competitions:tries.loading")}
          </p>
        </div>
      ) : tries.length === 0 ? (
        <Message severity="info" text={t("admin:competitions:tries.noTries")} />
      ) : (
        <DataTable
          value={tries}
          stripedRows
          responsiveLayout="scroll"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
        >
          <Column
            field="puzzle_id"
            header={t("admin:competitions:tries.puzzle")}
            sortable
          />
          <Column field="puzzle_lvl" header="Level" sortable />
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
          />
          <Column
            field="start_time"
            header={t("admin:competitions:tries.startTime")}
            body={(rowData) => formatDate(rowData.start_time)}
            sortable
          />
          <Column
            field="end_time"
            header={t("admin:competitions:tries.endTime")}
            body={(rowData) => formatDate(rowData.end_time)}
            sortable
          />
          <Column
            field="attempts"
            header={t("admin:competitions:tries.attempts")}
            body={attemptTemplate}
            sortable
          />
          <Column
            field="score"
            header={t("admin:competitions:tries.score")}
            body={scoreTemplate}
            sortable
          />
        </DataTable>
      )}
    </Dialog>
  );
}
