import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import LanguageSwitcher from "@shared/components/LanguageSwitcher";
import DefaultPasswordWarning from "./DefaultPasswordWarning";

import { isStaff } from "@utils/permissions";
import { useAuth } from "@contexts/AuthContext";
import { getTagLine } from "@/assets/resources/taglines";

const Navbar: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
  const { t } = useTranslation();
  const { user, hasDefaultPassword } = useAuth();
  const [tagline, setTagline] = useState<string>(getTagLine());
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const refreshTagline = useCallback(() => {
    setTagline(getTagLine());
  }, []);

  const navigateHome = useCallback(() => {
    window.location.href = "/";
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Generate navigation items based on user state
  const navbarData = React.useMemo(() => {
    const baseNavItems = [
      {
        id: "how-to-play",
        title: t("navigation:menus.howToPlay"),
      },
      {
        id: "support",
        title: t("navigation:menus.support"),
      },
    ];

    if (user) {
      const userItems = [
        {
          id: "account",
          title: t("navigation:menus.welcome") + " " + user.first_name,
        },
        {
          id: "competitions",
          title: t("navigation:menus.myCompetitions"),
        },
      ];

      if (isStaff(user)) {
        return [
          {
            id: "staff_portal",
            title: t("navigation:menus.staffPortal"),
          },
          ...baseNavItems,
          ...userItems,
        ];
      }

      return [...baseNavItems, ...userItems];
    }

    return [
      ...baseNavItems,
      {
        id: "login",
        title: t("navigation:menus.login"),
      },
    ];
  }, [user, t]);

  return (
    <>
      {hasDefaultPassword && <DefaultPasswordWarning />}

      <nav className="flex items-center relative z-[99999] justify-between py-6 w-[calc(100%-3rem)] max-h-[75px] mx-auto border-b border-white/10 border-dashed">
        {/* Logo and Tagline */}
        <div className="flex items-center font-semibold">
          <div className="flex flex-col items-start">
            <div onClick={navigateHome} className="cursor-pointer select-none">
              <span className="text-orange-500">Algo</span>
              <span>Hive.dev</span>
            </div>

            <small
              className="text-xs text-gray-400 cursor-alias select-none"
              onClick={refreshTagline}
            >
              {tagline}
            </small>
          </div>
        </div>

        {/* Burger Menu Button */}
        <button
          ref={buttonRef}
          className="lg:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-3">
          {navbarData.map((item) => (
            <li key={item.id} className="relative group">
              <Link
                to={`/${item.id}`}
                className="text-sm font-semibold text-white hover:text-white/80 transition-all duration-300 ease-in-out before:content-[''] before:absolute before:-bottom-1 before:left-0 before:w-full before:h-[2px] before:bg-white/10 before:scale-x-0 group-hover:before:scale-x-100 before:transition-transform before:duration-300"
              >
                {item.title}
              </Link>
            </li>
          ))}
          <li className="mt-1">
            <LanguageSwitcher />
          </li>
        </ul>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-0 w-full"
            >
              <ul className="bg-[#282828] text-white flex flex-col items-start gap-3 p-4 lg:hidden rounded-2xl shadow-lg">
                {navbarData.map((item) => (
                  <li key={item.id} className="w-full">
                    <Link
                      to={`/${item.id}`}
                      className="block text-sm font-semibold text-white hover:text-white/80 transition-all duration-300 ease-in-out"
                      onClick={closeMenu}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <LanguageSwitcher />
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
