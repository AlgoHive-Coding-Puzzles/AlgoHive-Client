import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";

import {
  createCompetition,
  updateCompetition,
} from "../../../../services/competitionsService";
import {
  fetchCatalogs,
  fetchCatalogThemes,
} from "../../../../services/catalogsService";
import {
  addGroupToCompetition,
  removeGroupFromCompetition,
  fetchCompetitionGroups,
} from "../../../../services/competitionsService";
import { Competition } from "../../../../models/Competition";
import { Catalog } from "../../../../models/Catalogs";
import { fetchScopes } from "../../../../services/scopesService";

interface CompetitionFormProps {
  visible: boolean;
  mode: "create" | "edit";
  competition: Competition | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CompetitionForm({
  visible,
  mode,
  competition,
  onSuccess,
  onCancel,
}: CompetitionFormProps) {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);

  // Form state
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Data lists
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<
    { id: string; name: string }[]
  >([]);

  const loadData = async () => {
    try {
      const [scopes, catalogs] = await Promise.all([
        fetchScopes(),
        fetchCatalogs(),
      ]);

      const groups = [];
      for (const scope of scopes) {
        if (!scope.groups) continue;
        for (const group of scope.groups) {
          groups.push({
            id: group.id,
            name: `${scope.name} - ${group.name}`,
          });
        }
      }

      setCatalogs(catalogs);
      setAvailableGroups(groups);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();

    // If editing, load competition groups
    if (mode === "edit" && competition) {
      loadCompetitionGroups(competition.id);
    }
  }, [mode, competition]);

  useEffect(() => {
    if (mode === "edit" && competition) {
      const selectedCatalog = catalogs.find(
        (catalog) => catalog.id === competition.catalog_id
      );

      const selectedGroups = availableGroups.filter((group) =>
        competition.groups?.some((g) => g.id === group.id)
      );
      setGroups(selectedGroups);
      setTitle(competition.title || "");
      setDescription(competition.description || "");
      setSelectedCatalog(selectedCatalog as Catalog);
      setSelectedTheme(competition.catalog_theme || "");
      setIsVisible(competition.show);
      setIsFinished(competition.finished);
    } else {
      resetForm();
    }
  }, [mode, competition, catalogs, availableGroups]);

  useEffect(() => {
    // Load themes when a catalog is selected
    const loadThemes = async () => {
      if (selectedCatalog) {
        const data = await fetchCatalogThemes(selectedCatalog.id);
        setThemes(data.map((theme) => theme.name));
      }
    };

    if (selectedCatalog) {
      loadThemes();
    } else {
      setThemes([]);
    }
  }, [selectedCatalog]);

  const loadCompetitionGroups = async (competitionId: string) => {
    try {
      const data = await fetchCompetitionGroups(competitionId);
      setGroups(
        data.map((group) => ({
          id: group.id,
          name: group.name,
        }))
      );
    } catch (error) {
      console.error("Error loading competition groups:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedTheme("");
    setSelectedCatalog(null);
    setGroups([]);
    setIsVisible(true);
    setIsFinished(false);
  };

  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    detail: string
  ) => {
    toast.current?.show({
      severity,
      summary: t(`common.states.${severity}`),
      detail,
      life: 3000,
    });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!title) {
      showToast("error", t("staffTabs.competitions.messages.titleRequired"));
      return;
    }
    if (!description) {
      showToast(
        "error",
        t("staffTabs.competitions.messages.descriptionRequired")
      );
      return;
    }
    if (!selectedTheme) {
      showToast(
        "error",
        t("staffTabs.competitions.messages.catalogThemeRequired")
      );
      return;
    }
    if (!selectedCatalog) {
      showToast(
        "error",
        t("staffTabs.competitions.messages.apiEnvironmentRequired")
      );
      return;
    }

    try {
      setSubmitting(true);

      const competitionData = {
        title,
        description,
        catalog_theme: selectedTheme,
        catalog_id: selectedCatalog.id,
        show: isVisible,
        finished: isFinished,
        groups_ids: groups.map((group) => group.id),
      };

      if (mode === "create") {
        await createCompetition(competitionData);
        showToast(
          "success",
          t("staffTabs.competitions.messages.createSuccess")
        );
      } else if (competition) {
        await updateCompetition(competition.id, competitionData);
        showToast(
          "success",
          t("staffTabs.competitions.messages.updateSuccess")
        );

        // Update groups
        const currentGroupIds = competition.groups?.map((g) => g.id) || [];
        const newGroupIds = groups.map((g) => g.id);

        // Groups to add
        for (const group of groups) {
          if (!currentGroupIds.includes(group.id)) {
            await addGroupToCompetition(competition.id, group.id);
          }
        }

        // Groups to remove
        for (const groupId of currentGroupIds) {
          if (!newGroupIds.includes(groupId)) {
            await removeGroupFromCompetition(competition.id, groupId);
          }
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting competition form:", error);
      showToast(
        "error",
        mode === "create"
          ? t("staffTabs.competitions.messages.createError")
          : t("staffTabs.competitions.messages.updateError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={
          mode === "create"
            ? t("staffTabs.competitions.create")
            : t("staffTabs.competitions.edit")
        }
        visible={visible}
        onHide={onCancel}
        style={{ width: "50rem" }}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label={t("common.actions.cancel")}
              icon="pi pi-times"
              className="p-button-text"
              onClick={onCancel}
            />
            <Button
              label={t("common.actions.save")}
              icon="pi pi-check"
              loading={submitting}
              onClick={handleSubmit}
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="title">
              {t("staffTabs.competitions.form.title")}
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={!title ? "p-invalid" : ""}
            />
            {!title && (
              <small className="p-error">
                {t("staffTabs.competitions.messages.titleRequired")}
              </small>
            )}
          </div>

          <div className="field mb-4">
            <label htmlFor="description">
              {t("staffTabs.competitions.form.description")}
            </label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              autoResize
              className={!description ? "p-invalid" : ""}
            />
            {!description && (
              <small className="p-error">
                {t("staffTabs.competitions.messages.descriptionRequired")}
              </small>
            )}
          </div>

          <div className="field mb-4">
            <label htmlFor="apiEnvironment">
              {t("staffTabs.competitions.form.apiEnvironment")}
            </label>
            <Dropdown
              id="apiEnvironment"
              value={selectedCatalog}
              onChange={(e) => setSelectedCatalog(e.value)}
              options={catalogs}
              optionLabel="name"
              placeholder={t("common.selects.catalogs")}
              className={!selectedCatalog ? "p-invalid" : ""}
              filter
            />
            {!selectedCatalog && (
              <small className="p-error">
                {t("staffTabs.competitions.messages.apiEnvironmentRequired")}
              </small>
            )}
          </div>

          {selectedCatalog && (
            <div className="field mb-4">
              <label htmlFor="catalogTheme">
                {t("staffTabs.competitions.form.catalogTheme")}
              </label>
              <Dropdown
                id="catalogTheme"
                value={selectedTheme}
                onChange={(e) => {
                  setSelectedTheme(e.value);
                }}
                options={themes}
                optionLabel="name"
                placeholder={t("common.selects.themes")}
                className={!selectedTheme ? "p-invalid" : ""}
                filter
              />
              {!selectedTheme && (
                <small className="p-error">
                  {t("staffTabs.competitions.messages.catalogThemeRequired")}
                </small>
              )}
            </div>
          )}

          <div className="field mb-4">
            <label htmlFor="groups">
              {t("staffTabs.competitions.form.groups")}
            </label>
            <MultiSelect
              id="groups"
              value={groups}
              onChange={(e) => setGroups(e.value)}
              options={availableGroups}
              optionLabel="name"
              placeholder={t("common.selects.groups")}
              filter
              display="chip"
              className="w-full"
            />
            <small className="text-gray-500">
              {groups.length === 0
                ? t("staffTabs.competitions.statistics.noGroups")
                : ""}
            </small>
          </div>

          <div className="field-checkbox mb-4">
            <Checkbox
              inputId="visible"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.checked ?? false)}
            />
            <label htmlFor="visible" className="ml-2">
              {t("staffTabs.competitions.form.visible")}
            </label>
          </div>

          {mode === "edit" && (
            <div className="field-checkbox mb-4">
              <Checkbox
                inputId="finished"
                checked={isFinished}
                onChange={(e) => setIsFinished(e.checked ?? false)}
              />
              <label htmlFor="finished" className="ml-2">
                {t("staffTabs.competitions.form.finished")}
              </label>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
