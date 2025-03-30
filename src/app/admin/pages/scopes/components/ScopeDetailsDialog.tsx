import React from "react";
import { t } from "i18next";

import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

import { Scope } from "@models/index";

interface ScopeDetailsDialogProps {
  visible: boolean;
  scope: Scope | null;
  onHide: () => void;
  onEdit: () => void;
}

const ScopeDetailsDialog: React.FC<ScopeDetailsDialogProps> = ({
  visible,
  scope,
  onHide,
  onEdit,
}) => {
  if (!scope) {
    return null;
  }

  const footerContent = (
    <div className="flex justify-end gap-2">
      <Button
        label={t("common:actions.close")}
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label={t("common:actions.edit")}
        icon="pi pi-pencil"
        onClick={() => {
          onHide();
          onEdit();
        }}
        className="p-button-warning"
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={scope.name}
      visible={visible}
      style={{ width: "550px" }}
      onHide={onHide}
      modal
      footer={footerContent}
      className="p-fluid"
      dismissableMask
    >
      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-2">
          {t("admin:scopes:information")}
        </h3>

        <div className="mb-4">
          <span className="font-medium">{t("admin:scopes:id")}: </span>
          <span className="text-gray-200">{scope.id}</span>
        </div>

        <div className="mb-4">
          <span className="font-medium">{t("admin:scopes:description")}: </span>
          <p className="mt-1 text-gray-200">
            {scope.description || t("admin:scopes:noDescription")}
          </p>
        </div>

        <Divider />

        <h3 className="text-lg font-semibold mb-3">
          {t("admin:scopes:catalogs")}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {scope.catalogs && scope.catalogs.length > 0 ? (
            scope.catalogs.map((catalog) => (
              <Chip
                key={catalog.id}
                label={catalog.name}
                className="bg-blue-700 text-white"
              />
            ))
          ) : (
            <p className="text-gray-400 italic">
              {t("admin:scopes:noCatalogs")}
            </p>
          )}
        </div>

        <Divider />

        <h3 className="text-lg font-semibold mb-3">
          {t("admin:scopes:roles")}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {scope.roles && scope.roles.length > 0 ? (
            scope.roles.map((role) => (
              <Chip
                key={role.id}
                label={role.name}
                className="bg-green-700 text-white"
              />
            ))
          ) : (
            <p className="text-gray-400 italic">{t("admin:scopes:noRoles")}</p>
          )}
        </div>

        <Divider />

        <h3 className="text-lg font-semibold mb-3">
          {t("admin:scopes:groups")}
        </h3>

        <div className="flex flex-wrap gap-2">
          {scope.groups && scope.groups.length > 0 ? (
            scope.groups.map((group) => (
              <Chip
                key={group.id}
                label={group.name}
                className="bg-purple-700 text-white"
              />
            ))
          ) : (
            <p className="text-gray-400 italic">{t("admin:scopes:noGroups")}</p>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ScopeDetailsDialog;
