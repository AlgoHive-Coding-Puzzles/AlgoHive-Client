// import { useTranslation } from "react-i18next";
import { useTranslation } from "react-i18next";
import AnimatedContainer from "../../components/AnimatedContainer";
import CirclePattern from "../../components/CirclePattern";
import Navbar from "../../components/users/Navbar";
import { cn } from "../../utils/utils";
import { Accordion, AccordionItem } from "../../components/ui/accordion";

export default function HowToPlay() {
  const { t } = useTranslation();

  const faqData = [
    {
      title: "Lorem ipsum dolor sit amet?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida justo ut felis condimentum, sit amet dignissim nulla porttitor.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida justo ut felis condimentum, sit amet dignissim nulla porttitor.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida justo ut felis condimentum, sit amet dignissim nulla porttitor.",
    },
    {
      title: "Lorem ipsum dolor sit amet?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida justo ut felis condimentum, sit amet dignissim nulla porttitor.",
    },
  ];

  return (
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
              <span className="text-amber-600 ">How </span> to play AlgoHive
            </h1>
            <p className="mt-6 max-w-[calc(100%-3rem)] lg:max-w-4xl text-lg lg:text-xl text-white/64 text-center mx-auto">
              You will find all the information you need to play the game here.
              FAQ, description of the game, and more.
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
          <p className="text-xl text-surface-500 dark:text-white/64">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            gravida justo ut felis condimentum, sit amet dignissim nulla
            porttitor. Pellentesque et dignissim sapien. Phasellus tortor justo,
            hendrerit sit amet pellentesque vitae, ultricies id est. Nullam
            molestie eros a lectus laoreet tristique. Donec finibus sollicitudin
            lobortis. Aenean rutrum dolor quis venenatis gravida. Curabitur id
            amet.
          </p>
          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 ">
              <a
                href={""}
                className="h-8 px-4 flex items-center justify-center shadow-stroke rounded-full hover:bg-surface-100 transition-all dark:shadow-none border-0 dark:border border-white/12 dark:hover:bg-white/8"
              >
                <i className="pi pi-link text-surface-950 dark:text-surface-0 text-base leading-none"></i>
              </a>
              <a
                href={""}
                className="h-8 px-4 flex items-center justify-center shadow-stroke rounded-full hover:bg-surface-100 transition-all dark:shadow-none border-0 dark:border border-white/12 dark:hover:bg-white/8"
              >
                <i className="pi pi-link text-surface-950 dark:text-surface-0 text-base leading-none"></i>
              </a>
              <a
                href={""}
                className="h-8 px-4 flex items-center justify-center shadow-stroke rounded-full hover:bg-surface-100 transition-all dark:shadow-none border-0 dark:border border-white/12 dark:hover:bg-white/8"
              >
                <i className="pi pi-link text-surface-950 dark:text-surface-0 text-base leading-none"></i>
              </a>
            </div>
          </div>

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
                Frequently <br /> Asked Questions
              </h1>
              <p className="text-xl text-center text-surface-500 dark:text-white/64 mt-6">
                Find quick answers to common questions about AlgoHive.
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
              Lorem ipsum dolor sit ex.
            </h5>
            <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              tempus dictum erat, sed venenatis elit pharetra vel. Donec rutrum
              posuere libero, quis finibus diam. Sed in ornare leo. Fusce quis
              fermentum lorem. Nullam non orci massa. Praesent ex metus,
              interdum mollis tortor in, condimentum finibus lorem. Aenean amet.
            </p>
            <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
              consequat metus, ut viverra neque. Nulla in purus nec ante
              sagittis bibendum. Curabitur consectetur convallis sapien, sit
              amet interdum lorem. Mauris vitae placerat enim. Suspendisse purus
              leo, laoreet nec porttitor non, porttitor et ante. Donec ut
              laoreet augue, at laoreet nibh. Maecenas hendrerit ligula eros.
            </p>
            <div className="flex md:flex-row flex-col items-center gap-6 mt-24"></div>
          </div>
          <div className="mt-24">
            <h5 className="text-4xl font-semibold text-surface-950 dark:text-surface-0 leading-tight">
              Lorem ipsum dolor sit ex.
            </h5>
            <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              tempus dictum erat, sed venenatis elit pharetra vel. Donec rutrum
              posuere libero, quis finibus diam. Sed in ornare leo. Fusce quis
              fermentum lorem. Nullam non orci massa.
            </p>
            <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
              consequat metus, ut viverra neque. Nulla in purus nec ante
              sagittis bibendum. Curabitur consectetur convallis sapien, sit
              amet interdum lorem. Mauris vitae placerat enim. Suspendisse purus
              leo, laoreet nec porttitor non, porttitor et ante. Donec ut
              laoreet augue, at laoreet nibh. Maecenas hendrerit ligula eros.
            </p>
            <ul className="mt-16 list-disc list-inside space-y-10">
              <li className="text-xl text-surface-500 dark:text-white/64">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
                consequat metus, ut viverra neque. Nulla in purus nec ante
                sagittis bibendum. Curabitur consectetur convallis sapien, sit
                amet interdum lorem. Mauris vitae placerat enim. Suspendisse
                purus leo.
              </li>
              <li className="text-xl text-surface-500 dark:text-white/64">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
                consequat metus, ut viverra neque. Nulla in purus nec ante
                sagittis bibendum.
              </li>
              <li className="text-xl text-surface-500 dark:text-white/64">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
                consequat metus, ut viverra neque. Nulla in purus nec ante
                sagittis bibendum.
              </li>
            </ul>
          </div>
          <div className="mt-16">
            <h5 className="text-4xl font-semibold text-surface-950 dark:text-surface-0 leading-tight">
              Lorem ipsum
              <br />
              dolor sit ex.
            </h5>
            <p className="text-xl text-surface-500 dark:text-white/64 mt-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
              consequat metus, ut viverra neque. Nulla in purus nec ante
              sagittis bibendum. Curabitur consectetur convallis sapien, sit
              amet interdum lorem. Mauris vitae placerat enim. Suspendisse purus
              leo.
            </p>
          </div>
          <AnimatedContainer className="mt-18 rounded-4xl bg-main-gradient p-10">
            <div className="flex items-start justify-between gap-4"></div>
            <p className="mt-7 text-2xl text-white/80 leading-snug">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu
              consequat metus, ut viverra neque. Nulla in purus nec ante
              sagittis bibendum. Curabitur consectetur convallis sapien, sit
              amet interdum lorem. Mauris vitae placerat enim. Suspendisse purus
              leo, laoreet nec porttitor non, porttitor et ante. Donec ut
              laoreet augue, at laoreet nibh. Maecenas hendrerit ligula eros.
            </p>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
}
