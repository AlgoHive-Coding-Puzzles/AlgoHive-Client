"use client";
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { isStaff } from "../../utils/permissions";
import LanguageSwitcher from "../LanguageSwitcher";
import { t } from "i18next";
import { motion } from "framer-motion"; // Import framer-motion

const TAG_LINES = [
  "{:year {year}}",
  "y({year})",
  "$year={year}",
  "{'year':{year}}",
  "//{year}",
  "0.0.0.0:{year}",
  "0x{year}",
];

const getTagLine = () => {
  const randomIndex = Math.floor(Math.random() * TAG_LINES.length);
  return TAG_LINES[randomIndex].replace(
    "{year}",
    new Date().getFullYear().toString()
  );
};

const Navbar: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
  const { user } = useAuth();
  const [tagline, setTagline] = React.useState<string>(getTagLine());
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const navbarData = [
    {
      id: "how-to-play",
      title: t("users.menus.howToPlay"),
    },
    {
      id: "support",
      title: t("users.menus.support"),
    },
  ];

  const staffPortalNav = [
    {
      id: "staff_portal",
      title: t("users.menus.staffPortal"),
    },
  ];

  const acountNav = [
    {
      id: "account",
      title: t("users.menus.welcome") + " " + user?.firstname,
    },
    {
      id: "competitions",
      title: t("users.menus.myCompetitions"),
    },
  ];

  const logginNav = [
    {
      id: "login",
      title: t("users.menus.login"),
    },
  ];

  if (user) {
    navbarData.push(...acountNav);
    if (isStaff(user)) {
      navbarData.unshift(...staffPortalNav);
    }
  } else {
    navbarData.push(...logginNav);
  }

  return (
    <nav className="flex items-center relative z-[99999] justify-between py-6 w-[calc(100%-3rem)] max-h-[75px] mx-auto border-b border-white/10 border-dashed">
      <div className="flex items-center font-semibold">
        <div className="flex flex-col items-start">
          <div
            onClick={() => {
              window.location.href = "/";
            }}
            style={{
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <span className="text-orange-500">Algo</span>
            <span>Hive.dev</span>
          </div>

          <small
            className="text-xs text-gray-400"
            onClick={() => {
              setTagline(getTagLine());
            }}
            style={{
              cursor: "alias",
              userSelect: "none",
            }}
          >
            {tagline}
          </small>
        </div>
      </div>
      {/* Burger Menu Button */}
      <button
        ref={buttonRef}
        className="lg:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                  onClick={() => setIsMenuOpen(false)}
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
    </nav>
  );
};

export default Navbar;
