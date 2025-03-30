import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface PasswordResetDialogProps {
  visible: boolean;
  onHide: () => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  handleForgotPassword: (e: React.FormEvent) => void;
  isResetting: boolean;
  t: (key: string) => string;
}

export const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({
  visible,
  onHide,
  resetEmail,
  setResetEmail,
  handleForgotPassword,
  isResetting,
  t,
}) => (
  <Dialog
    visible={visible}
    onHide={onHide}
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
        loading={isResetting}
        disabled={isResetting}
      />
    </form>
  </Dialog>
);

export default PasswordResetDialog;
