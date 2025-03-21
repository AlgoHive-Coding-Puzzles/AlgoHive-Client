import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getStaffMenuItems } from "../../components/admin/MenuItem";
import AppDock from "../../components/admin/dock/Dock";

import { useActivePage } from "../../contexts/ActivePageContext";

export default function Admin() {
  const { t } = useTranslation();
  const { activePage, setActivePage } = useActivePage();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Becomes sticky when the user scrolls past 50px
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Dynamically load the CSS
    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("type", "text/css");
    styleLink.setAttribute("href", "/admin-styles.css");
    styleLink.setAttribute("id", "admin-styles");
    document.head.appendChild(styleLink);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);

      // Remove the CSS when unmounting
      const styleElement = document.getElementById("admin-styles");
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const StaffMenuItems = getStaffMenuItems(t);

  // Find the active component to render
  const ActiveComponent = StaffMenuItems.find(
    (menu) => menu.id === activePage
  )?.Component;

  return (
    <div className="layout-wrapper layout-dark">
      <div
        className={`layout-topbar ${isSticky ? "layout-topbar-sticky" : ""}`}
      ></div>

      <div className="layout-content">
        {" "}
        <div className="">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            {ActiveComponent != null ? (
              <div className="p-4 min-h-screen mb-28">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {t("navigation.staff." + activePage)}
                  </h1>
                  <div className="w-20 h-1 bg-amber-500 rounded"></div>
                </div>
                <ActiveComponent />
              </div>
            ) : (
              <></>
            )}
          </Suspense>
        </div>
      </div>
      <AppDock setPage={(page: string) => setActivePage(page)} />
    </div>
  );
}
