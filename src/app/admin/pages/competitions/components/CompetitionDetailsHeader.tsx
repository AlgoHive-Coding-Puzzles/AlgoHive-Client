import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

import { Competition } from "@/models";

interface CompetitionDetailsHeaderProps {
  competition: Competition;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onFinishCompetition: () => void;
  onDelete: () => void;
}

/**
 * CompetitionDetailsHeader - Header component for competition details
 *
 * Displays title, status tags, and action buttons
 */
export default function CompetitionDetailsHeader({
  competition,
  onEdit,
  onToggleVisibility,
  onFinishCompetition,
  onDelete,
}: CompetitionDetailsHeaderProps) {
  const { t } = useTranslation(["common", "staffTabs"]);

  return (
    <div className="competition-header mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">{competition.title}</h2>
          <div className="flex gap-2">
            {competition.finished ? (
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

            {competition.show ? (
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
        </div>

        <div className="flex gap-2">
          <Button
            icon="pi pi-pencil"
            label={t("common:actions.edit")}
            className="p-button-outlined p-button-success"
            onClick={onEdit}
          />
          <Button
            icon="pi pi-flag-fill"
            label={
              competition.finished
                ? t("admin:competitions:actions.unfinish")
                : t("admin:competitions:actions.finish")
            }
            className="p-button-outlined p-button-warning"
            onClick={onFinishCompetition}
          />
          <Button
            icon={competition.show ? "pi pi-eye-slash" : "pi pi-eye"}
            label={
              competition.show
                ? t("admin:competitions:actions.hide")
                : t("admin:competitions:actions.show")
            }
            className="p-button-outlined p-button-secondary"
            onClick={onToggleVisibility}
          />
          <Button
            icon="pi pi-trash"
            label={t("common:actions.delete")}
            className="p-button-outlined p-button-danger"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
