import React from "react";
import { t } from "i18next";

import AnimatedContainer from "@/app/shared/components/AnimatedContainer";
import LanguageSwitcher from "@/app/shared/components/LanguageSwitcher";
import CirclePattern from "@/app/shared/components/CirclePattern";

import { useAuth } from "@contexts/AuthContext";

const Footer: React.FC = () => {
  const { user } = useAuth();

  const socials = [
    { icon: "pi pi-crown", link: "https://ko-fi.com/Y8Y41CI3RB" },
    {
      icon: "pi pi-discord",
      link: "https://discordapp.com/users/387291278670430208",
    },
    { icon: "pi pi-github", link: "https://github.com/Eric-Philippe" },
  ];

  const footerNavsDataLinks = [
    { label: t("users.footer.links.howToPlay"), to: "/how-to-play" },
    { label: t("users.footer.links.support"), to: "/support" },
    { label: t("users.footer.links.license"), to: "/license" },
  ];

  const footerNavsDataProject = [
    {
      label: t("users.footer.project.github"),
      to: "https://github.com/AlgoHive-Coding-Puzzles",
    },
    {
      label: t("users.footer.project.createPuzzles"),
      to: "https://github.com/AlgoHive-Coding-Puzzles/BeeLine",
    },
    {
      label: t("users.footer.project.host"),
      to: "https://github.com/AlgoHive-Coding-Puzzles/AlgoHive-Infra",
    },
    {
      label: t("users.footer.project.kofi"),
      to: "https://ko-fi.com/Y8Y41CI3RB",
    },
  ];

  const footerNavsDataMore = [
    {
      label: t("users.footer.moreChallenges.aoc"),
      to: "https://adventofcode.com/",
    },
    {
      label: t("users.footer.moreChallenges.htb"),
      to: "https://www.hackthebox.com/",
    },
    {
      label: t("users.footer.moreChallenges.cg"),
      to: "https://www.codingame.com/start/fr/",
    },
  ];

  if (user) {
    footerNavsDataLinks.push({
      label: t("users.footer.links.profile"),
      to: `/account`,
    });
  }

  const footerNavsData = [
    {
      title: t("users.footer.links.title"),
      items: footerNavsDataLinks,
    },
    {
      title: t("users.footer.project.title"),
      items: footerNavsDataProject,
    },
    {
      title: t("users.footer.moreChallenges.title"),
      items: footerNavsDataMore,
    },
  ];

  return (
    <AnimatedContainer>
      <footer className="relative rounded-3xl lg:rounded-[3rem] container">
        <div className="w-full px-5 pt-5 lg:pt-[5.5rem] pb-10 rounded-3xl lg:rounded-4xl overflow-hidden relative bg-main-gradient shadow-black-card">
          <div className="mb-20 pb-36 pt-16 flex items-center justify-center border-b border-white/10 border-dashed ">
            <div className="max-w-[34rem] mx-auto">
              <h1 className="title text-4xl lg:text-6xl font-semibold text-center !leading-tight">
                {t("users.footer.title")}
              </h1>
              <p className="text-lg lg:text-xl text-white/64 text-center max-w-[25rem] mx-auto mt-6">
                {t("users.footer.description")}
              </p>
            </div>
          </div>

          <CirclePattern className="absolute -bottom-12 opacity-50 translate-y-1/2 w-[50rem] lg:w-[80rem] -translate-x-1/2 left-1/2" />
          <div className="max-w-[64rem] mx-auto flex lg:flex-row flex-col">
            <div className="flex-1 flex flex-col justify-between gap-4 py-4 lg:px-0 px-4">
              <a href="#">
                <span className="text-orange-500 font-bold">Algo</span>
                <span className="text-surface-0">Hive.dev</span>
              </a>

              <LanguageSwitcher />
              <div className="hidden lg:flex items-center gap-2">
                {socials.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="h-8 px-4 flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-white/12 bg-white/4 hover:bg-white/12 transition-all"
                  >
                    <i className={`${item.icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-between md:gap-x-10 lg:gap-x-24 gap-y-7">
              {footerNavsData.map((data, index) => (
                <div key={index} className="p-2 flex flex-col gap-2">
                  <div className="px-3 py-2 text-surface-0 text-xl font-medium">
                    {data.title}
                  </div>
                  <div className="flex flex-col gap-2">
                    {data.items.map((item, j) => (
                      <a
                        key={j}
                        href={item.to}
                        className="px-3 py-2 w-fit text-white/72 hover:text-white hover:bg-white/10 rounded-full transition-all"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden flex items-center justify-center gap-2 mt-52">
            {socials.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="h-8 px-4 flex items-center justify-center rounded-full backdrop-blur-sm text-surface-0 border border-white/12 bg-white/4 hover:bg-white/12 transition-all"
              >
                <i className={`${item.icon} text-sm`}></i>
              </a>
            ))}
          </div>
          <div className="w-full lg:w-[calc(100%-5rem)] mt-8 lg:mt-32 pt-10 flex items-center justify-center text-surface-0 border-t border-dashed border-white/10">
            © {new Date().getFullYear()} AlgoHive
          </div>
        </div>
      </footer>
    </AnimatedContainer>
  );
};

export default Footer;
