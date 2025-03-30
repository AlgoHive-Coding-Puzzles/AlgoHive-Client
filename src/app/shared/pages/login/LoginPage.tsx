import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import LanguageSwitcher from "@shared/components/LanguageSwitcher";

import { ServiceManager } from "@/services";

import { useAuth } from "@contexts/AuthContext";

const LoginPage = () => {
  const { t } = useTranslation();

  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast>(null);

  const from = location.state?.from || "/";

  if (user) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
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
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await requestPasswordReset(resetEmail);
      ServiceManager.auth.requestPasswordReset(resetEmail);

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
      toast.current?.show({
        severity: "error",
        summary: t("auth:login.error"),
        detail: t("auth:resetPassword.error"),
        life: 3000,
      });
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('/login.png')` }}
      >
        <Toast ref={toast} />

        <div className="flex flex-col md:flex-row rounded-lg shadow-lg w-full md:w-3/4 overflow-hidden">
          {/* Right section (login) - top on mobile */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center rounded-b-lg md:rounded-b-none md:rounded-r-lg border-2 border-white bg-transparent order-1 md:order-2">
            <h1 className="text-2xl font-semibold mb-4 text-center">
              {t("auth:login.title")}
            </h1>
            {error && (
              <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  {t("auth:login.email")}
                </label>
                <InputText
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-inputtext"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  {t("auth:login.password")}
                </label>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  feedback={false}
                  toggleMask
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">{t("auth:login.remember")}</label>
                </div>
                <a
                  className="text-blue-500"
                  onClick={() => setShowForgotDialog(true)}
                  style={{ cursor: "pointer" }}
                >
                  {t("auth:login.forgot")}
                </a>
              </div>
              <Button
                type="submit"
                label={t("auth:login.submit")}
                className="w-full p-button-primary"
                loading={loading}
                disabled={loading}
              />
            </form>
            <Divider className="my-4" />
            <p className="text-center text-sm mt-4">
              {t("auth:login.noAccount")}{" "}
              <a className="text-blue-500">{t("auth:login.askAdmin")}</a>
            </p>
          </div>

          {/* Left section (features) - bottom on mobile */}
          <div
            className="w-full md:w-1/2 p-6 md:p-10 text-black flex flex-col justify-center order-2 md:order-1"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("auth:login.welcome")}{" "}
              <span className="text-amber-400">{t("common:app.name")}</span>
            </h2>
            <p className="mb-6">{t("auth:login.tagline")}</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-xl mr-2">🐝</span>
                <div>
                  <h3 className="font-semibold">
                    {t("auth:login.feature1.title")}
                  </h3>
                  <p className="text-sm">{t("auth:login.feature1.desc")}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-2">🧩</span>
                <div>
                  <h3 className="font-semibold">
                    {t("auth:login.feature2.title")}
                  </h3>
                  <p className="text-sm">{t("auth:login.feature2.desc")}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-2">🏆</span>
                <div>
                  <h3 className="font-semibold">
                    {t("auth:login.feature3.title")}
                  </h3>
                  <p className="text-sm">{t("auth:login.feature3.desc")}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-2">🌐</span>
                <div>
                  <h3 className="font-semibold">
                    {t("auth:login.feature4.title")}
                  </h3>
                  <span className="text-sm">
                    {t("auth:login.feature4.desc")} <LanguageSwitcher />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        visible={showForgotDialog}
        onHide={() => setShowForgotDialog(false)}
        header={t("auth:resetPassword.title")}
        className="w-[90vw] md:w-[500px]"
      >
        <div className="mb-4 text-sm text-gray-600">
          {t("auth:resetPassword.desc")}
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label htmlFor="resetEmail" className="block text-sm font-medium">
              {t("auth:login.email")}
            </label>
            <InputText
              id="resetEmail"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="w-full p-inputtext"
            />
          </div>
          <Button
            type="submit"
            label={t("auth:resetPassword.submit")}
            className="w-full p-button-primary"
          />
        </form>
      </Dialog>
    </>
  );
};

export default LoginPage;
