import { useAuth } from "@/lib/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import FormField from "./FormField";
import { Group, User } from "@/models";

interface UserInfoSectionProps {
  user: User;
  groups: Group[];
}

const UserInfoSection = ({ user, groups }: UserInfoSectionProps) => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="py-6 border-b border-white/12 flex flex-col gap-10">
      <h4 className="text-3xl font-bold text-surface-0">
        {t("auth:accountSettings")}
      </h4>

      {/* Logout button */}
      <div className="flex flex-col sm:flex-row gap-2 items-start">
        <div className="sm:flex-[0.45] text-lg text-surface-0 font-medium">
          <button
            className="button-regular px-5 py-3 min-w-40 bg-red-900 hover:bg-red-800 text-surface-0 font-medium rounded-2xl"
            onClick={handleLogout}
          >
            {t("common:actions.logout")}
          </button>
        </div>
      </div>

      {/* User information fields */}
      <FormField
        label={t("common:fields.firstName")}
        value={user?.first_name}
        placeholder="Username"
        disabled
      />
      <FormField
        label={t("common:fields.lastName")}
        value={user?.last_name}
        placeholder="Username"
        disabled
      />
      <FormField
        label={t("common:fields.email")}
        value={user?.email}
        placeholder="email@this.com"
        disabled
      />
      <FormField
        label={t("common:fields.groups")}
        value={groups.map((group) => group.description).join(", ")}
        disabled
      />
    </div>
  );
};

export default UserInfoSection;
