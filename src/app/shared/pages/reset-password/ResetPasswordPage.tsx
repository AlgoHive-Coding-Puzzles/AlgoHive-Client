import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { ServiceManager } from "@/services";

const ResetPasswordPage = () => {
  const { t } = useTranslation(["common", "login"]);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  if (!token) {
    navigate("/login");
    return null;
  }

  const isReady = () => {
    return (
      password &&
      confirmPassword &&
      password.length >= 8 &&
      password === confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.current?.show({
        severity: "error",
        summary: t("auth:resetPassword.error"),
        detail: t("auth:.passwordsMismatch"),
        life: 3000,
      });
      return;
    }

    try {
      await ServiceManager.auth.resetPassword(token, password);

      toast.current?.show({
        severity: "success",
        summary: t("auth:resetPassword.success"),
        detail: t("auth:resetPassword.resetSuccess"),
        life: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.current?.show({
        severity: "error",
        summary: t("auth:resetPassword.error"),
        detail: t("auth:resetPassword.errorMessage"),
        life: 3000,
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/login.png')` }}
    >
      <Toast ref={toast} />

      <div className="w-full max-w-md p-6 bg-white/70 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          {t("auth:resetPassword.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              {t("auth:resetPassword.newPassword")}
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              className="w-full"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              {t("auth:resetPassword.confirmNewPassword")}
            </label>
            <Password
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              toggleMask
              feedback={false}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            label={t("auth:resetPassword.submit")}
            className="w-full p-button-primary"
            disabled={!isReady()}
          />
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
