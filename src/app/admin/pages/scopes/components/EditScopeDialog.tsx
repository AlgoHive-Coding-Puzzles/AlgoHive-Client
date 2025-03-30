import React, { useEffect, useState } from "react";
import { t } from "i18next";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";

import { Scope } from "@models/index";

interface EditScopeDialogProps {
  visible: boolean;
  scope: Scope | null;
  apiOptions: { label: string; value: string }[];
  onHide: () => void;
  onSave: (
    id: string,
    name: string,
    description: string,
    catalogs: string[]
  ) => Promise<void>;
  loading: boolean;
}

const EditScopeDialog: React.FC<EditScopeDialogProps> = ({
  visible,
  scope,
  apiOptions,
  onHide,
  onSave,
  loading,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedApiIds, setSelectedApiIds] = useState<string[]>([]);

  useEffect(() => {
    if (scope) {
      setName(scope.name);
      setDescription(scope.description || "");
      setSelectedApiIds(
        scope.catalogs ? scope.catalogs.map((catalog) => catalog.id) : []
      );
    }
  }, [scope]);

  const handleSave = async () => {
    if (scope) {
      await onSave(scope.id, name, description, selectedApiIds);
    }
  };

  const footerContent = (
    <div className="flex justify-end gap-2">
      <Button
        label={t("common:actions.cancel")}
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label={t("common:actions.save")}
        icon="pi pi-check"
        onClick={handleSave}
        loading={loading}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={t("admin:scopes:editScope")}
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
      modal
      footer={footerContent}
      className="p-fluid"
      dismissableMask
    >
      <div className="field mt-4">
        <label htmlFor="edit-scope-name" className="font-bold">
          {t("admin:scopes:name")}
        </label>
        <InputText
          id="edit-scope-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="w-full"
        />
      </div>

      <div className="field mt-4">
        <label htmlFor="edit-scope-description" className="font-bold">
          {t("admin:scopes:description")}
        </label>
        <InputTextarea
          id="edit-scope-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full"
        />
      </div>

      <div className="field mt-4">
        <label htmlFor="edit-scope-catalogs" className="font-bold">
          {t("admin:scopes:catalogs")}
        </label>
        <MultiSelect
          id="edit-scope-catalogs"
          value={selectedApiIds}
          options={apiOptions}
          onChange={(e) => setSelectedApiIds(e.value)}
          display="chip"
          className="w-full"
        />
      </div>
    </Dialog>
  );
};

export default EditScopeDialog;
