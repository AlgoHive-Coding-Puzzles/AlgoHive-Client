import { useEffect, useState } from "react";
import AnimatedContainer from "../../AnimatedContainer";
import { Competition } from "../../../models/Competition";
import { fetchUserCompetitions } from "../../../services/competitionsService";
import { t } from "i18next";
import { MeteorsCard } from "../../MeteorsCard";
import { useAuth } from "../../../contexts/AuthContext";
import CirclePattern from "../../CirclePattern";

const UsersHomeCompetitions = () => {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchAllCompetitions = async () => {
      try {
        const fetchedCompetitions = await fetchUserCompetitions();
        setCompetitions(fetchedCompetitions);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };

    fetchAllCompetitions();
  }, []);

  return (
    <div className="container mt-32 lg:mt-80" style={{ minHeight: "75vh" }}>
      <span className="text-xl font-semibold text-surface-950 dark:text-surface-0">
        {t("users.competitions")}
      </span>
      <h1 className="mt-2 text-3xl lg:text-6xl font-semibold text-surface-950 dark:text-surface-0">
        {t("users.selectCompetition")}
      </h1>
      <div className="mt-14 flex flex-col">
        {!competitions || competitions.length === 0 ? (
          <AnimatedContainer
            delay={100}
            visibleClass="animate-in fade-in slide-in-from-top-24 duration-500"
          >
            <div className="absolute -bottom-[195%] md:-bottom-[320%] 2xl:-bottom-[210%] -left-[40rem] w-[82rem]">
              <CirclePattern className="  right-[40rem] w-[82rem]" />
            </div>
            <div className="flex flex-col items-center justify-center mt-12 md:mt-24 w-full">
              <MeteorsCard>
                <h1 className="relative z-50 mb-4 text-xl font-bold text-white">
                  {t("users.noCompetitions")}
                </h1>

                {!user && (
                  <>
                    <h2 className="relative z-50 mb-4 font-normal text-slate-500 text-lg">
                      {t("users.connectYourAccount")}
                    </h2>

                    <button className="mt-6 bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-0.5 text-lg font-semibold leading-6 text-white inline-block">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                        <span>{t("users.menus.login")}</span>
                        <svg
                          fill="none"
                          height="20"
                          viewBox="0 0 24 24"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.75 8.75L14.25 12L10.75 15.25"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                  </>
                )}
              </MeteorsCard>
            </div>
          </AnimatedContainer>
        ) : (
          <>
            {competitions.map((item, index) => (
              <AnimatedContainer key={index} delay={index * 200}>
                <div className="group py-6 lg:py-8 pr-6 lg:pr-8 pl-8 lg:pl-12 rounded-full flex items-center justify-between hover:bg-amber-100 hover:text-orange-600 transition-colors cursor-pointer border border-white/12 mb-2">
                  <div className="w-[23rem] flex-1 lg:flex-none text-2xl md:text-4xl font-semibold text-surface-950 dark:text-surface-0 group-hover:text-surface-0 dark:group-hover:text-surface-950 transition-colors">
                    {item.title}
                  </div>
                  <div className="lg:block hidden relative w-[25rem] h-full">
                    <div className="opacity-100 absolute top-1/2 -translate-y-1/2 text-lg text-surface-950 dark:text-surface-0">
                      {item.description}
                    </div>
                  </div>
                  <button className="w-20 h-20 shadow-stroke dark:shadow-none group-hover:bg-dark rounded-full flex items-center justify-center text-surface-950 dark:text-surface-0 group-hover:text-surface-0 dark:group-hover:text-surface-950 border-0 dark:border border-amber/12 transition-all">
                    <i className="pi pi-arrow-right text-3xl"></i>
                  </button>
                </div>
              </AnimatedContainer>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersHomeCompetitions;
