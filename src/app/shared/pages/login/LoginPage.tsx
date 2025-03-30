import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";

import { ServiceManager } from "@/services";
import { useAuth } from "@contexts/AuthContext";

import { LoginForm, FeatureSection, PasswordResetDialog } from "./components";

const LoginPage = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  // Move user navigation check to useEffect
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Memoize event handlers for better performance
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        await login(email, password, rememberMe);
        navigate(from, { replace: true });
      } catch (e) {
        console.error("Login error:", e);
        setError(t("auth:login.invalidEmailOrPassword"));
        toast.current?.show({
          severity: "error",
          summary: t("auth:login.error"),
          detail: t("auth:login.invalidCredentials"),
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [email, password, rememberMe, login, navigate, from, t]
  );

  const handleForgotPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsResetting(true);
      try {
        await ServiceManager.auth.requestPasswordReset(resetEmail);

        toast.current?.show({
          severity: "success",
          summary: t("auth:resetPassword.success"),
          detail: t("auth:resetPassword.successMessage"),
          life: 3000,
        });
        setShowForgotDialog(false);
        setResetEmail("");
      } catch (error) {
        console.error("Error resetting password:", error);
        // More detailed error handling
        const errorMessage =
          error instanceof Error
            ? error.message
            : t("auth:resetPassword.error");
        toast.current?.show({
          severity: "error",
          summary: t("auth:login.error"),
          detail: errorMessage,
          life: 3000,
        });
      } finally {
        setIsResetting(false);
      }
    },
    [resetEmail, t]
  );

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[url('/login.png')] bg-cover bg-center">
        <Toast ref={toast} />

        <div className="flex flex-col md:flex-row rounded-lg shadow-lg w-full md:w-3/4 overflow-hidden">
          {/* Right section (login) - top on mobile */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center rounded-b-lg md:rounded-b-none md:rounded-r-lg border-2 border-white bg-transparent order-1 md:order-2">
            <h1 className="text-2xl font-semibold mb-4 text-center">
              {t("auth:login.title")}
            </h1>

            <LoginForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              loading={loading}
              error={error}
              setShowForgotDialog={setShowForgotDialog}
              t={t}
            />

            <Divider className="my-4" />
            <p className="text-center text-sm mt-4">
              {t("auth:login.noAccount")}{" "}
              <a className="text-blue-500">{t("auth:login.askAdmin")}</a>
            </p>
          </div>

          {/* Left section (features) - bottom on mobile */}
          <div className="w-full md:w-1/2 p-6 md:p-10 text-black flex flex-col justify-center order-2 md:order-1 bg-white/70">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("auth:login.welcome")}{" "}
              <span className="text-amber-400">{t("common:app.name")}</span>
            </h2>
            <p className="mb-6">{t("auth:login.tagline")}</p>
            <FeatureSection t={t} />
          </div>
        </div>
      </div>

      <PasswordResetDialog
        visible={showForgotDialog}
        onHide={() => setShowForgotDialog(false)}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        handleForgotPassword={handleForgotPassword}
        isResetting={isResetting}
        t={t}
      />
    </>
  );
};

export default LoginPage;
