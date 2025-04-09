import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "../locales/en/common.json";
import commonFr from "../locales/fr/common.json";
import navigationEn from "../locales/en/navigation.json";
import navigationFr from "../locales/fr/navigation.json";
import licenseEn from "../locales/en/license.json";
import licenseFr from "../locales/fr/license.json";
import supportEn from "../locales/en/support.json";
import supportFr from "../locales/fr/support.json";
import leaderboardEn from "../locales/en/leaderboard.json";
import leaderboardFr from "../locales/fr/leaderboard.json";
import authEn from "../locales/en/auth.json";
import authFr from "../locales/fr/auth.json";
import footerEn from "../locales/en/footer.json";
import footerFr from "../locales/fr/footer.json";
import homeEn from "../locales/en/home.json";
import homeFr from "../locales/fr/home.json";
import howToPlayEn from "../locales/en/howToPlay.json";
import howToPlayFr from "../locales/fr/howToPlay.json";
import competitionsEn from "../locales/en/competitions.json";
import competitionsFr from "../locales/fr/competitions.json";
import puzzlesEn from "../locales/en/puzzles.json";
import puzzlesFr from "../locales/fr/puzzles.json";
import accountEn from "../locales/en/account.json";
import accountFr from "../locales/fr/account.json";
import adminDashboardEn from "../locales/en/admin/dashboard.json";
import adminDashboardFr from "../locales/fr/admin/dashboard.json";
import adminCatalogsEn from "../locales/en/admin/catalogs.json";
import adminCatalogsFr from "../locales/fr/admin/catalogs.json";
import adminCompetitionsEn from "../locales/en/admin/competitions.json";
import adminCompetitionsFr from "../locales/fr/admin/competitions.json";
import adminGroupsEn from "../locales/en/admin/groups.json";
import adminGroupsFr from "../locales/fr/admin/groups.json";
import adminRolesEn from "../locales/en/admin/roles.json";
import adminRolesFr from "../locales/fr/admin/roles.json";
import adminScopesEn from "../locales/en/admin/scopes.json";
import adminScopesFr from "../locales/fr/admin/scopes.json";
import adminUsersEn from "../locales/en/admin/users.json";
import adminUsersFr from "../locales/fr/admin/users.json";

const RESOURCES = {
  en: {
    common: commonEn,
    navigation: navigationEn,
    license: licenseEn,
    support: supportEn,
    leaderboard: leaderboardEn,
    auth: authEn,
    footer: footerEn,
    home: homeEn,
    howToPlay: howToPlayEn,
    competitions: competitionsEn,
    puzzles: puzzlesEn,
    account: accountEn,
    admin: {
      dashboard: adminDashboardEn,
      catalogs: adminCatalogsEn,
      competitions: adminCompetitionsEn,
      groups: adminGroupsEn,
      roles: adminRolesEn,
      scopes: adminScopesEn,
      users: adminUsersEn,
    },
  },
  fr: {
    common: commonFr,
    navigation: navigationFr,
    license: licenseFr,
    support: supportFr,
    leaderboard: leaderboardFr,
    auth: authFr,
    footer: footerFr,
    home: homeFr,
    howToPlay: howToPlayFr,
    competitions: competitionsFr,
    puzzles: puzzlesFr,
    account: accountFr,
    admin: {
      dashboard: adminDashboardFr,
      catalogs: adminCatalogsFr,
      competitions: adminCompetitionsFr,
      groups: adminGroupsFr,
      roles: adminRolesFr,
      scopes: adminScopesFr,
      users: adminUsersFr,
    },
  },
};

const DETECTION_OPTIONS = {
  order: ["localStorage", "navigator"],
  caches: ["localStorage"],
};

export const defaultNS = "common";

i18n
  .use(LanguageDetector)
  // .use(intervalPlural)
  .use(initReactI18next)
  .init({
    detection: DETECTION_OPTIONS,
    resources: RESOURCES,
    defaultNS,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
