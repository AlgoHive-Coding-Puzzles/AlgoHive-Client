import { useState, useRef } from "react";
import { t } from "i18next";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import { ServiceManager } from "../../services";

/**
 * Custom hook for managing users in tables
 */
export const useUserManagement = (fetchData: () => Promise<void>) => {
  // State
  const [userDialog, setUserDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const toast = useRef<Toast>(null);

  // Form fields state
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    selectedRoles: [] as string[],
    selectedGroup: null as string | null,
  });

  // Reset form to initial state
  const resetForm = () => {
    setFormFields({
      first_name: "",
      last_name: "",
      email: "",
      selectedRoles: [],
      selectedGroup: null,
    });
    setSelectedUser(null);
  };

  // Update a form field
  const updateFormField = (field: string, value: string | string[] | null) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  };

  // Open dialog for new user
  const openNewUserDialog = () => {
    resetForm();
    setEditMode(false);
    setUserDialog(true);
  };

  // Open dialog for editing a user
  const openEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setFormFields({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      selectedRoles:
        user.roles
          ?.filter((role: Role) => role.name != "Owner")
          ?.map((role) => role.id) || [],
      selectedGroup: null,
    });
    setEditMode(true);
    setUserDialog(true);
  };

  // Validate form
  const validateForm = (requireRoles: boolean = false) => {
    if (!formFields.first_name.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: t("common.states.validationError"),
        detail: t("staffTabs.users.validation.firstNameRequired"),
        life: 3000,
      });
      return false;
    }

    if (!formFields.last_name.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: t("common.states.validationError"),
        detail: t("staffTabs.users.validation.lastNameRequired"),
        life: 3000,
      });
      return false;
    }

    if (!formFields.email.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: t("common.states.validationError"),
        detail: t("staffTabs.users.validation.emailRequired"),
        life: 3000,
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formFields.email)) {
      toast.current?.show({
        severity: "warn",
        summary: t("common.states.validationError"),
        detail: t("staffTabs.users.validation.validEmail"),
        life: 3000,
      });
      return false;
    }

    if (
      requireRoles &&
      (!formFields.selectedRoles || formFields.selectedRoles.length === 0)
    ) {
      toast.current?.show({
        severity: "warn",
        summary: t("common.states.validationError"),
        detail: t("staffTabs.users.validation.roleRequired"),
        life: 3000,
      });
      return false;
    }

    return true;
  };

  // Confirm user deletion
  const confirmDeleteUser = (
    user: User,
    deleteFunc: (userId: string) => Promise<void>
  ) => {
    confirmDialog({
      message: t("staffTabs.users.deleteUserMsg", {
        user: `${user.first_name} ${user.last_name}`,
      }),
      header: t("staffTabs.users.deleteUser"),
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteFunc(user.id);
          await fetchData();
          toast.current?.show({
            severity: "success",
            summary: t("common.states.success"),
            detail: t("staffTabs.users.messages.userDeleted"),
            life: 3000,
          });
        } catch (err) {
          console.error("Error deleting user:", err);
          toast.current?.show({
            severity: "error",
            summary: t("common.states.error"),
            detail: t("staffTabs.users.messages.errorDeleting"),
            life: 3000,
          });
        }
      },
    });
  };

  // Confirm reset password
  const confirmResetPassword = (user: User) => {
    confirmDialog({
      message: t("staffTabs.users.confirmations.resetPassword", {
        user: `${user.first_name} ${user.last_name}`,
      }),
      header: t("common.confirmations.resetPassword"),
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-info",
      accept: async () => {
        try {
          await ServiceManager.auth.resetTargetUserPassword(user.id);
          toast.current?.show({
            severity: "success",
            summary: t("common.states.success"),
            detail: t("staffTabs.users.messages.passwordReset"),
            life: 3000,
          });
        } catch (err) {
          console.error("Error resetting password:", err);
          toast.current?.show({
            severity: "error",
            summary: t("common.states.error"),
            detail: t("staffTabs.users.messages.errorResettingPassword"),
            life: 3000,
          });
        }
      },
    });
  };

  return {
    userDialog,
    setUserDialog,
    editMode,
    selectedUser,
    formFields,
    toast,
    updateFormField,
    resetForm,
    openNewUserDialog,
    openEditUserDialog,
    validateForm,
    confirmDeleteUser,
    confirmResetPassword,
  };
};
