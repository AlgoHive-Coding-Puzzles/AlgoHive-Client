import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <div className="language-switcher font-semibold text-sm">
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        aria-label={t("language.select", "Select language")}
        id="language-select"
      >
        <option className="text-black" value="fr">
          Français
        </option>
        <option className="text-black" value="en">
          English
        </option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
