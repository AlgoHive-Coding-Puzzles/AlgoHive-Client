import { JSX, lazy } from "react";
import { TFunction } from "i18next";
import { User } from "../../models/User";
import { Permission, rolesHavePermission } from "../../utils/permissions";

// Lazy load components
const HomePage = lazy(() => import("../../pages/admin/home/Home"));
const UsersPage = lazy(() => import("../../pages/admin/users/Users"));
const RolesPage = lazy(() => import("../../pages/admin/roles/Roles"));
const ScopesPage = lazy(() => import("../../pages/admin/scopes/Scopes"));
const GroupsPage = lazy(() => import("../../pages/admin/groups/Groups"));
const CompetitionsPage = lazy(
  () => import("../../pages/admin/competitions/Competitions")
);
const CatalogsPage = lazy(() => import("../../pages/admin/catalogs/Catalogs"));

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  Component: React.LazyExoticComponent<() => JSX.Element>;
  permissions?: string[];
  showInMenu?: (user: User) => boolean;
}

// Function that returns translated menu items
export const getStaffMenuItems = (t: TFunction): MenuItem[] => [
  {
    id: "home",
    label: t("navigation.staff.home"),
    icon: "pi pi-home",
    color: "#F2C94C", // Jaune miel
    Component: HomePage,
  },
  {
    id: "catalogs",
    label: t("navigation.staff.catalogs"),
    icon: "pi pi-server",
    color: "#8D6E33", // Ambre foncé
    Component: CatalogsPage,
    showInMenu: (user: User) => !user.blocked,
  },
  {
    id: "scopes",
    label: t("navigation.staff.scopes"),
    icon: "pi pi-building",
    color: "#4F3A1B", // Brun foncé
    Component: ScopesPage,
    showInMenu: (user: User) =>
      rolesHavePermission(user.roles, Permission.SCOPES) && !user.blocked,
  },
  {
    id: "roles",
    label: t("navigation.staff.roles"),
    icon: "pi pi-shield",
    color: "#E0A800", // Ambre doré
    Component: RolesPage,
    showInMenu: (user: User) =>
      rolesHavePermission(user.roles, Permission.ROLES) && !user.blocked,
  },
  {
    id: "groups",
    label: t("navigation.staff.groups"),
    icon: "pi pi-users", // Icône de groupe (plusieurs personnes)
    color: "#7D6608", // Brun miel
    Component: GroupsPage,
    showInMenu: (user: User) => !user.blocked,
  },
  {
    id: "users",
    label: t("navigation.staff.users"),
    icon: "pi pi-user", // Changé pour une icône d'utilisateur individuel
    color: "#BF8F30", // Ambre clair
    Component: UsersPage,
    showInMenu: (user: User) => !user.blocked,
  },
  {
    id: "competitions",
    label: t("navigation.staff.competitions"),
    icon: "pi pi-graduation-cap",
    color: "#5A3E28", // Brun foncé
    Component: CompetitionsPage,
    showInMenu: (user: User) => !user.blocked,
  },
];
