import AnimatedContainer from "../../components/AnimatedContainer";
import CirclePattern from "../../components/CirclePattern";
import Navbar from "../../components/users/Navbar";

import Shape2 from "../../components/icons/shapes/shape-2.svg";
import Shape3 from "../../components/icons/shapes/shape-3.svg";
import Shape4 from "../../components/icons/shapes/shape-4.svg";
import Shape5 from "../../components/icons/shapes/shape-5.svg";

import "./Home.css";
import UsersListCompetitions from "../../components/UsersListCompetitions";
import MacbookScroll from "../../components/users/MacbookScroll";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

export default function Users() {
  const { t } = useTranslation();

  return (
    <>
      <AnimatedContainer>
        <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
          <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
        </div>
        <div className="container relative">
          <div className=" h-full relative ">
            <Navbar className="relative" />
            <div className="px-6 lg:px-12 mt-10 lg:mt-20 relative z-4">
              <h1 className=" leading-tight text-white text-4xl lg:text-7xl font-semibold lg:px-3">
                <span className="text-amber-600">{t("users.are")} </span>{" "}
                {t("users.youReady")}{" "}
                <span className="hidden lg:inline-flex w-[25rem] justify-between p-2 border border-white/12 rounded-full">
                  <img src={Shape2} alt="" />
                  <img src={Shape3} alt="" />
                  <img src={Shape4} alt="" />
                  <img src={Shape5} alt="" />
                </span>{" "}
                {t("users.toExplore")}
              </h1>
            </div>
          </div>
        </div>
      </AnimatedContainer>

      <MacbookScroll src="/github.png" />

      <UsersListCompetitions className="mt-32 lg:mt-80" />

      <Footer />
    </>
  );
}
