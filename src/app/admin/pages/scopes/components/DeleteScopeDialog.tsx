import React from "react";
import { t } from "i18next";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { Scope } from "@models/index";

interface DeleteScopeDialogProps {
  visible: boolean;
  scope: Scope | null;
  onHide: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteScopeDialog: React.FC<DeleteScopeDialogProps> = ({
  visible,
  scope,
  onHide,
  onConfirm,
  loading,
}) => {
  if (!scope) {
    return null;
  }

  const footerContent = (
    <div className="flex justify-end gap-2">
      <Button
        label={t("common:actions.cancel")}
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label={t("common:actions.delete")}
        icon="pi pi-trash"
        onClick={onConfirm}
        className="p-button-danger"
        loading={loading || (scope.groups && scope.groups.length > 0)}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={t("admin:scopes:deleteScope")}
      visible={visible}
      style={{ width: "450px" }}
      onHide={onHide}
      modal
      footer={footerContent}
      dismissableMask
    >
      <div className="align-items-center p-5 text-center">
        <i className="pi pi-exclamation-triangle text-5xl text-yellow-500 mb-4" />
        <h4 className="mb-2">{t("admin:scopes:confirmDelete")}</h4>
        <p className="mb-0">
          {t("admin:scopes:confirmDeleteMessage", { name: scope.name })}
        </p>

        {scope.groups && scope.groups.length > 0 && (
          <p className="text-center mt-3 text-danger-500">
            {t("admin:scopes:dangerGroupsAssigned", {
              count: scope.groups.length,
              groups: t("admin:scopes:groups").toLowerCase(),
            })}
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteScopeDialog;
