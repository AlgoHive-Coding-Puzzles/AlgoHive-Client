import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";

import { ServiceManager } from "@/services";

import { Competition, Catalog } from "@/models";

interface CompetitionFormProps {
  visible: boolean;
  mode: "create" | "edit";
  competition: Competition | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * CompetitionForm - Form component for creating/editing competitions
 *
 * This component handles form validation and submission for competitions.
 */
export default function CompetitionForm({
  visible,
  mode,
  competition,
  onSuccess,
  onCancel,
}: CompetitionFormProps) {
  const { t } = useTranslation(["common", "staffTabs"]);
  const toast = useRef<Toast>(null);
  const isSubmitAttempted = useRef<boolean>(false);

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

  // Form validation
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    catalog?: string;
    theme?: string;
  }>({});

  /**
   * Load necessary data (catalogs, groups) for the form
   */
  const loadData = useCallback(async () => {
    try {
      const [scopes, catalogs] = await Promise.all([
        ServiceManager.scopes.fetchAll(),
        ServiceManager.catalogs.fetchCatalogs(),
      ]);

      const formattedGroups = scopes
        .flatMap((scope) =>
          (scope.groups || []).map((group) => ({
            id: group.id,
            name: `${scope.name} - ${group.name}`,
          }))
        )
        .filter((group) => group.id);

      setCatalogs(catalogs);
      setAvailableGroups(formattedGroups);
    } catch (error) {
      console.error("Error loading data:", error);
      showToast("error", t("common:states.error"));
    }
  }, [t]);

  // Load initial data on mount
  useEffect(() => {
    loadData();

    // If editing, load competition groups
    if (mode === "edit" && competition) {
      loadCompetitionGroups(competition.id);
    }
  }, [mode, competition, loadData]);

  // Set form values when editing an existing competition
  useEffect(() => {
    if (mode === "edit" && competition && catalogs.length > 0) {
      const selectedCatalog = catalogs.find(
        (catalog) => catalog.id === competition.catalog_id
      );

      const selectedGroups = availableGroups.filter((group) =>
        competition.groups?.some((g) => g.id === group.id)
      );

      setTitle(competition.title || "");
      setDescription(competition.description || "");
      setSelectedCatalog(selectedCatalog as Catalog);
      setSelectedTheme(competition.catalog_theme || "");
      setIsVisible(competition.show);
      setIsFinished(competition.finished);
      setGroups(selectedGroups);
    } else if (mode === "create") {
      resetForm();
    }
  }, [mode, competition, catalogs, availableGroups]);

  // Load themes when catalog is selected
  useEffect(() => {
    const loadThemes = async () => {
      if (selectedCatalog) {
        try {
          const data = await ServiceManager.catalogs.fetchCatalogThemes(
            selectedCatalog.id
          );
          setThemes(data.map((theme) => theme.name));
        } catch (error) {
          console.error("Error loading themes:", error);
          showToast("error", t("admin:competitions:messages.themesLoadError"));
        }
      }
    };

    if (selectedCatalog) {
      loadThemes();
    } else {
      setThemes([]);
    }
  }, [selectedCatalog, t]);

  /**
   * Load competition groups when editing
   */
  const loadCompetitionGroups = async (competitionId: string) => {
    try {
      const data = await ServiceManager.competitions.fetchGroups(competitionId);
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

  /**
   * Reset form fields to default values
   */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedTheme("");
    setSelectedCatalog(null);
    setGroups([]);
    setIsVisible(true);
    setIsFinished(false);
    setErrors({});
    isSubmitAttempted.current = false;
  };

  /**
   * Display toast notification
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
   * Validates the form and returns true if valid
   */
  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      description?: string;
      catalog?: string;
      theme?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = t("admin:competitions:messages.titleRequired");
    }

    if (!description.trim()) {
      newErrors.description = t(
        "admin:competitions:messages.descriptionRequired"
      );
    }

    if (!selectedCatalog) {
      newErrors.catalog = t(
        "admin:competitions:messages.apiEnvironmentRequired"
      );
    }

    if (!selectedTheme) {
      newErrors.theme = t("admin:competitions:messages.catalogThemeRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    isSubmitAttempted.current = true;

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (mode === "create") {
        await ServiceManager.competitions.create(
          title,
          description,
          selectedTheme!,
          selectedCatalog!.id,
          isVisible,
          isFinished,
          groups.map((group) => group.id)
        );

        showToast("success", t("admin:competitions:messages.createSuccess"));
      } else if (competition) {
        await ServiceManager.competitions.update(
          competition.id,
          title,
          description,
          selectedTheme!,
          selectedCatalog!.id,
          isVisible,
          isFinished,
          groups.map((group) => group.id)
        );

        showToast("success", t("admin:competitions:messages.updateSuccess"));
      }

      // Reset form and notify parent of success
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error submitting competition form:", error);
      showToast(
        "error",
        mode === "create"
          ? t("admin:competitions:messages.createError")
          : t("admin:competitions:messages.updateError")
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle dialog close/cancel
   */
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <Dialog
        header={
          mode === "create"
            ? t("admin:competitions:create")
            : t("admin:competitions:edit")
        }
        visible={visible}
        onHide={handleCancel}
        style={{ width: "50rem" }}
        modal
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label={t("common:actions.cancel")}
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleCancel}
              disabled={submitting}
            />
            <Button
              label={t("common:actions.save")}
              icon="pi pi-check"
              loading={submitting}
              onClick={handleSubmit}
            />
          </div>
        }
      >
        <div className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="title" className="font-medium">
              {t("admin:competitions:form.title")}*
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "p-invalid" : ""}
              maxLength={100}
            />
            {errors.title && <small className="p-error">{errors.title}</small>}
          </div>

          <div className="field mb-4">
            <label htmlFor="description" className="font-medium">
              {t("admin:competitions:form.description")}*
            </label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              autoResize
              className={errors.description ? "p-invalid" : ""}
              maxLength={500}
            />
            {errors.description && (
              <small className="p-error">{errors.description}</small>
            )}
          </div>

          <div className="field mb-4">
            <label htmlFor="apiEnvironment" className="font-medium">
              {t("admin:competitions:form.apiEnvironment")}*
            </label>
            <Dropdown
              id="apiEnvironment"
              value={selectedCatalog}
              onChange={(e) => setSelectedCatalog(e.value)}
              options={catalogs}
              optionLabel="name"
              placeholder={t("common:selects.catalogs")}
              className={errors.catalog ? "p-invalid" : ""}
              filter
            />
            {errors.catalog && (
              <small className="p-error">{errors.catalog}</small>
            )}
          </div>

          {selectedCatalog && (
            <div className="field mb-4">
              <label htmlFor="catalogTheme" className="font-medium">
                {t("admin:competitions:form.catalogTheme")}*
              </label>
              <Dropdown
                id="catalogTheme"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.value)}
                options={themes}
                placeholder={t("common:selects.themes")}
                className={errors.theme ? "p-invalid" : ""}
                filter
                disabled={themes.length === 0}
              />
              {errors.theme && (
                <small className="p-error">{errors.theme}</small>
              )}
              {themes.length === 0 && selectedCatalog && (
                <small className="text-gray-500">
                  {t("admin:competitions:messages.noThemesAvailable")}
                </small>
              )}
            </div>
          )}

          <div className="field mb-4">
            <label htmlFor="groups" className="font-medium">
              {t("admin:competitions:form.groups")}
            </label>
            <MultiSelect
              id="groups"
              value={groups}
              onChange={(e) => setGroups(e.value)}
              options={availableGroups}
              optionLabel="name"
              placeholder={t("common:selects.groups")}
              filter
              display="chip"
              className="w-full"
            />
          </div>

          <div className="field-checkbox mb-4">
            <Checkbox
              inputId="visible"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.checked ?? false)}
            />
            <label htmlFor="visible" className="ml-2 font-medium">
              {t("admin:competitions:form.visible")}
            </label>
          </div>

          {mode === "edit" && (
            <div className="field-checkbox mb-4">
              <Checkbox
                inputId="finished"
                checked={isFinished}
                onChange={(e) => setIsFinished(e.checked ?? false)}
              />
              <label htmlFor="finished" className="ml-2 font-medium">
                {t("admin:competitions:form.finished")}
              </label>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
