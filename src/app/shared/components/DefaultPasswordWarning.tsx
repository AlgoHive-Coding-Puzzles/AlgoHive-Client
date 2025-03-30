import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const DefaultPasswordWarning: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-[100000] w-full bg-gradient-to-r from-orange-500 to-red-500 rounded-b-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center py-3 sm:py-2 gap-2 sm:gap-0 sm:justify-between">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs sm:text-sm font-medium text-white">
              {t("navigation:security.defaultPasswordWarning")}
            </p>
          </div>
          <Link
            to="/account"
            className="flex items-center justify-center space-x-1 text-xs sm:text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md"
          >
            <span>{t("navigation:security.changePassword")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DefaultPasswordWarning;
