import React from "react";
import LanguageSwitcher from "@shared/components/LanguageSwitcher";
import FeatureItem from "./FeatureItem";

interface FeatureSectionProps {
  t: (key: string) => string;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ t }) => (
  <div className="space-y-4">
    <FeatureItem
      icon="🐝"
      title={t("auth:login.feature1.title")}
      description={t("auth:login.feature1.desc")}
    />
    <FeatureItem
      icon="🧩"
      title={t("auth:login.feature2.title")}
      description={t("auth:login.feature2.desc")}
    />
    <FeatureItem
      icon="🏆"
      title={t("auth:login.feature3.title")}
      description={t("auth:login.feature3.desc")}
    />
    <FeatureItem
      icon="🌐"
      title={t("auth:login.feature4.title")}
      description={
        <span className="text-sm">
          {t("auth:login.feature4.desc")} <LanguageSwitcher />
        </span>
      }
    />
  </div>
);

export default FeatureSection;
