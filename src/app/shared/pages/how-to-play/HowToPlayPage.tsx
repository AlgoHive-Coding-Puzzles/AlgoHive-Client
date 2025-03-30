import { useTranslation } from "react-i18next";

import { Accordion, AccordionItem } from "@shared/components/ui/accordion";
import AnimatedContainer from "@shared/components/AnimatedContainer";
import { MeteorsCard } from "@/app/shared/components/ui/meteor-card";
import CirclePattern from "@shared/components/CirclePattern";
import Footer from "@/app/shared/components/Footer";
import Navbar from "@shared/components/Navbar";

import { useAuth } from "@contexts/AuthContext";

export default function HowToPlayPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const faqData = [
    {
      title: t("howToPlay:faq.question1.title"),
      content: t("howToPlay:faq.question1.desc"),
    },
    {
      title: t("howToPlay:faq.question2.title"),
      content: t("howToPlay:faq.question2.desc"),
    },
    {
      title: t("howToPlay:faq.question3.title"),
      content: t("howToPlay:faq.question3.desc"),
    },
    {
      title: t("howToPlay:faq.question4.title"),
      content: t("howToPlay:faq.question4.desc"),
    },
    {
      title: t("howToPlay:faq.question5.title"),
      content: t("howToPlay:faq.question5.desc"),
    },
    {
      title: t("howToPlay:faq.question6.title"),
      content: t("howToPlay:faq.question6.desc"),
    },
  ];

  return (
    <>
      <section>
        <AnimatedContainer
          visibleClass="!slide-in-from-top-0"
          className="relative"
        >
          <div className="bg-main-gradient h-[51.5rem] absolute top-0 inset-x-0"></div>
          <div className="container relative">
            <div className="h-[51.5rem] absolute top-0 left-4 right-4">
              <div className="absolute inset-0 overflow-hidden lg:block hidden">
                <CirclePattern className="absolute w-[82rem] -bottom-full translate-y-24 left-1/2 -translate-x-1/2" />
              </div>
            </div>
            <div className="relative z-20">
              <Navbar />
              <h1 className="max-w-[calc(100%-3rem)] lg:max-w-5xl mx-auto title lg:text-6xl text-4xl text-center mt-18 font-bold">
                <span className="text-amber-600 ">{t("howToPlay:how")} </span>{" "}
                {t("howToPlay:toPlayAlgohive")}
              </h1>
              <p className="mt-6 max-w-[calc(100%-3rem)] lg:max-w-4xl text-lg lg:text-xl text-white/64 text-center mx-auto">
                {t("howToPlay:description")}
              </p>
            </div>
            <div className="relative z-10 h-[35rem] max-w-[calc(100%-3rem)] lg:max-w-[calc(100%-12rem)] mt-16 lg:mt-40 mx-auto rounded-4xl shadow-black-card overflow-hidden">
              <img
                className="object-cover"
                src={"/howto-hero.png"}
                alt="Blog Hero Image"
                width={800}
                height={600}
                // fill
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>
        </AnimatedContainer>
        <div className="container mt-6 lg:mt-24 max-w-[56rem] px-4">
          <div>
            <h5 className="text-4xl font-semibold text-surface-950  dark:text-surface-0 leading-tight">
              {t("howToPlay:paragraphs.p1.title")}
            </h5>
            <p className="text-xl text-surface-500 dark:text-white/64 mt-5">
              {t("howToPlay:paragraphs.p1.desc1")}
            </p>

            <div className="mt-20">
              <div className="max-w-[58rem] px-4 mx-auto">
                <div className="icon-box flex items-center justify-center">
                  <img
                    src="/questions-comments.svg"
                    alt="Questions and Comments"
                    width={100}
                    height={100}
                  />
                </div>
                <h1 className="mt-10 text-center text-3xl lg:text-5xl font-semibold text-surface-950 leading-tight">
                  {t("howToPlay:faq.title1")} <br /> {t("howToPlay:faq.title2")}
                </h1>
                <p className="text-xl text-center text-surface-500 dark:text-white/64 mt-6">
                  {t("howToPlay:faq.desc")}
                </p>
                <Accordion className="mt-14">
                  {faqData.map((item, index) => (
                    <AnimatedContainer
                      key={index}
                      delay={150 * index}
                      visibleClass="!slide-in-from-top-20"
                    >
                      <AccordionItem {...item} />
                    </AnimatedContainer>
                  ))}
                </Accordion>
              </div>
            </div>
            <div className="mt-20">
              <h5 className="text-4xl font-semibold text-surface-950  dark:text-surface-0 leading-tight">
                {t("howToPlay:paragraphs.p2.title")}
              </h5>
              <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
                {t("howToPlay:paragraphs.p2.desc1")}
              </p>
              <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
                {t("howToPlay:paragraphs.p2.desc2")}
              </p>
              <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
                {t("howToPlay:paragraphs.p2.desc3")}
              </p>
              <div className="flex md:flex-row flex-col items-center gap-6 mt-12"></div>
            </div>
            <div className="mt-12">
              <h5 className="text-4xl font-semibold text-surface-950 dark:text-surface-0 leading-tight">
                {t("howToPlay:paragraphs.p3.title")}
              </h5>
              <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
                {t("howToPlay:paragraphs.p3.desc")}
              </p>
            </div>
            <div className="mt-16">
              <h5 className="text-4xl font-semibold text-surface-950 dark:text-surface-0 leading-tight">
                {t("howToPlay:paragraphs.p4.title")}
              </h5>
              <ul className="mt-16 list-disc list-inside space-y-10">
                <li className="text-xl text-surface-500 dark:text-white/64">
                  {t("howToPlay:paragraphs.p4.desc1")}
                </li>
                <li className="text-xl text-surface-500 dark:text-white/64">
                  {t("howToPlay:paragraphs.p4.desc2")}
                </li>
                <li className="text-xl text-surface-500 dark:text-white/64">
                  {t("howToPlay:paragraphs.p4.desc3")}
                </li>
                <li className="text-xl text-surface-500 dark:text-white/64">
                  {t("howToPlay:paragraphs.p4.desc4")}
                </li>
              </ul>
            </div>
            <AnimatedContainer className="mt-18 rounded-4xl bg-main-gradient p-10">
              <div className="flex items-start justify-between gap-4"></div>
              <p className="mt-7 text-2xl text-white/80 leading-snug">
                {t("howToPlay:catchphrase")}
              </p>
              <AnimatedContainer
                delay={100}
                visibleClass="animate-in fade-in slide-in-from-top-24 duration-500"
              >
                <div className="absolute -bottom-[195%] md:-bottom-[320%] 2xl:-bottom-[210%] -left-[40rem] w-[82rem]">
                  <CirclePattern className="  right-[40rem] w-[82rem]" />
                </div>
                <div className="flex flex-col   mt-12 md:mt-24 w-full">
                  <MeteorsCard>
                    {user && (
                      <h1 className="relative z-50 mb-4 text-xl font-bold text-white">
                        {t("howToPlay:alreadyLoggedIn")}
                      </h1>
                    )}

                    {!user && (
                      <>
                        <h2 className="relative z-50 mb-4 font-normal text-slate-500 text-lg">
                          {t("howToPlay:connectYourAccount")}
                        </h2>

                        <button className="mt-6 bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-0.5 text-lg font-semibold leading-6 text-white inline-block">
                          <span className="absolute inset-0 overflow-hidden rounded-full">
                            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          </span>
                          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10">
                            <span>{t("navigation:menus.login")}</span>
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
            </AnimatedContainer>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
