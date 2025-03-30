import { useTranslation } from "react-i18next";
import FormField from "./FormField";

interface PasswordChangeSectionProps {
  oldPassword: string;
  setOldPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handlePasswordChange: () => void;
  loading: boolean;
  hasChanges: boolean;
}

const PasswordChangeSection = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordChange,
  loading,
  hasChanges,
}: PasswordChangeSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="py-10 border-b border-white/12 flex flex-col gap-10">
        <FormField
          label={t("common:fields.changePassword")}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          type="password"
          placeholder="*******"
        />
        <FormField
          label={t("common:fields.confirmPassword")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          placeholder="*******"
        />
        <FormField
          label={t("common:fields.currentPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="*******"
        />
      </div>

      <div className="pt-10 flex justify-end">
        <button
          className="button-regular px-5 py-3 min-w-40 bg-amber-700 hover:bg-amber-800 text-surface-0 font-medium rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePasswordChange}
          disabled={!hasChanges || loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
              {t("common:states.loading")}
            </div>
          ) : (
            t("common:actions.save")
          )}
        </button>
      </div>
    </>
  );
};

export default PasswordChangeSection;
