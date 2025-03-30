import React from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

interface LoginFormProps {
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  loading: boolean;
  error: string;
  setShowForgotDialog: (show: boolean) => void;
  t: (key: string) => string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  setShowForgotDialog,
  t,
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
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
        className="text-blue-500 cursor-pointer"
        onClick={() => setShowForgotDialog(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setShowForgotDialog(true);
          }
        }}
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
);

export default LoginForm;
