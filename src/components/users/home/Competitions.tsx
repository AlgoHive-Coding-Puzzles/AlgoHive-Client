import { useEffect, useState } from "react";
import AnimatedContainer from "../../AnimatedContainer";
import { Competition } from "../../../models/Competition";
import { fetchUserCompetitions } from "../../../services/competitionsService";
import { t } from "i18next";

const UsersHomeCompetitions = () => {
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
    <div className="container mt-24 lg:mt-80" style={{ minHeight: "75vh" }}>
      <span className="text-xl font-semibold text-surface-950 dark:text-surface-0">
        {t("users.competitions")}
      </span>
      <h1 className="mt-2 text-3xl lg:text-6xl font-semibold text-surface-950 dark:text-surface-0">
        {t("users.selectCompetition")}
      </h1>
      <div className="mt-14 flex flex-col">
        {competitions.length === 0 ? (
          <div className="flex items-center justify-center w-full h-96">
            <div className="text-3xl text-surface-950 dark:text-surface-0">
              {t("users.noCompetitions")}
            </div>
          </div>
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
