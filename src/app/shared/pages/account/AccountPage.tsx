import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "primereact/toast";

import AnimatedContainer from "@shared/components/AnimatedContainer";
import CirclePattern from "@shared/components/CirclePattern";
import Footer from "@shared/components/Footer";
import Navbar from "@shared/components/Navbar";

import PasswordChangeSection from "./components/PasswordChangeSection";
import UserInfoSection from "./components/UserInfoSection";

import { ServiceManager } from "@/services";

import { useAuth } from "@/lib/contexts/AuthContext";

import { Group, User } from "@/models";

const AccountPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const toast = useRef<Toast>(null);

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Derived state
  const hasChanges = Object.values(passwordData).every((value) => value !== "");

  // Update password field handler
  const handlePasswordFieldChange = (field: string) => (value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await ServiceManager.groups.fetchUserGroups();
        setGroups(groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handlePasswordChange = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      toast.current?.show({
        severity: "error",
        summary: t("common:states.error"),
        detail: t("auth:passwordMismatch"),
        life: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await ServiceManager.users.changePassword(oldPassword, newPassword);

      // Clear form on success
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.current?.show({
        severity: "success",
        summary: t("common:states.success"),
        detail: t("auth:passwordChanged"),
        life: 3000,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.current?.show({
        severity: "error",
        summary: t("common:states.error"),
        detail: t("auth:passwordChangeFailed"),
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-20">
      <Toast ref={toast} />
      <AnimatedContainer>
        <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
          <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
        </div>
        <div className="container relative">
          <div className="h-full relative">
            <Navbar className="relative" />
            <div className="p-6 mt-10 md:p-12 rounded-2xl lg:rounded-4xl bg-white/5 backdrop-blur-[48px] md:max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
              <UserInfoSection user={user as User} groups={groups} />

              <PasswordChangeSection
                oldPassword={passwordData.oldPassword}
                setOldPassword={handlePasswordFieldChange("oldPassword")}
                newPassword={passwordData.newPassword}
                setNewPassword={handlePasswordFieldChange("newPassword")}
                confirmPassword={passwordData.confirmPassword}
                setConfirmPassword={handlePasswordFieldChange(
                  "confirmPassword"
                )}
                handlePasswordChange={handlePasswordChange}
                loading={loading}
                hasChanges={hasChanges}
              />
            </div>
          </div>
        </div>
      </AnimatedContainer>
      <Footer />
    </div>
  );
};

export default AccountPage;
