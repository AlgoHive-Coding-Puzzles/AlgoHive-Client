import React from "react";
import { t } from "i18next";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { Group } from "@/models";

interface DeleteGroupDialogProps {
  visible: boolean;
  group: Group | null;
  onHide: () => void;
  onConfirm: () => void;
  loading: boolean;
}

/**
 * Dialog component for confirming group deletion
 */
const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  visible,
  group,
  onHide,
  onConfirm,
  loading,
}) => {
  if (!group) return null;

  const renderFooter = () => {
    return (
      <div>
        <Button
          label={t("common:actions.cancel")}
          icon="pi pi-times"
          className="p-button-text"
          onClick={onHide}
          disabled={loading}
        />
        <Button
          label={t("common:actions.delete")}
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={onConfirm}
          loading={loading || (group.users && group.users.length > 0)}
        />
      </div>
    );
  };

  return (
    <Dialog
      header={t("admin:groups:deleteGroup")}
      visible={visible}
      onHide={onHide}
      style={{ width: "450px" }}
      footer={renderFooter()}
      closable={!loading}
      dismissableMask={!loading}
    >
      <div className="align-items-center p-5 text-center">
        <i
          className="pi pi-exclamation-triangle text-6xl text-yellow-500 mb-4"
          style={{ fontSize: "3rem" }}
        />
        <h4 className="m-0 mb-3 font-bold">
          {t("admin:groups:confirmDelete")}
        </h4>
        <p className="text-center mb-0">
          {t("admin:groups:confirmDeleteMessage", { name: group.name })}
        </p>

        {group.users && group.users.length > 0 && (
          <p className="text-center mt-3 text-danger-500">
            {t("admin:groups:dangerUsersAssigned", {
              count: group.users.length,
              users: t("admin:groups:students").toLowerCase(),
            })}
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteGroupDialog;
