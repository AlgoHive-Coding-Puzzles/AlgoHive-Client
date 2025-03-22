import React from "react";
import CirclePattern from "./CirclePattern";
import AnimatedContainer from "./AnimatedContainer";

const Footer: React.FC = () => {
  const socials = [
    { icon: "pi pi-youtube", link: "#" },
    { icon: "pi pi-twitter", link: "#" },
    { icon: "pi pi-discord", link: "#" },
  ];

  const footerNavsData = [
    {
      title: "Links",
      items: [
        { label: "Account", to: "/pages/travel" },
        { label: "Competitions", to: "/pages/saas" },
        { label: "Leaderboard", to: "/pages/startup" },
        { label: "How To Play", to: "/pages/enterprise" },
      ],
    },
    {
      title: "The Project",
      items: [
        { label: "GitHub", to: "/second-pages/about" },
        { label: "Pricing", to: "/second-pages/pricing" },
        { label: "Blog", to: "/second-pages/blog" },
        { label: "Blog Detail", to: "/second-pages/blog/detail" },
        { label: "Contact", to: "/second-pages/contact" },
      ],
    },
    {
      title: "More challenges",
      items: [
        { label: "Advent of Code", to: "/second-pages/signup" },
        { label: "HackTheBox", to: "/second-pages/signin" },
        { label: "CodingGames", to: "/second-pages/404" },
      ],
    },
  ];

  return (
    <AnimatedContainer>
      <footer className="relative rounded-3xl lg:rounded-[3rem] container">
        <div className="w-full px-5 pt-5 lg:pt-[5.5rem] pb-10 rounded-3xl lg:rounded-4xl overflow-hidden relative bg-main-gradient shadow-black-card">
          <div className="mb-20 pb-36 pt-16 flex items-center justify-center border-b border-white/10 border-dashed ">
            <div className="max-w-[34rem] mx-auto">
              <h1 className="title text-4xl lg:text-6xl font-semibold text-center !leading-tight">
                Ready to explore the AlgoHive platform?
              </h1>
              <p className="text-lg lg:text-xl text-white/64 text-center max-w-[25rem] mx-auto mt-6">
                Join us today and start your journey towards mastering
                algorithms and data structures. SelfHosted, open-source, and
                free to use.
              </p>
            </div>
          </div>

          <CirclePattern className="absolute -bottom-12 opacity-50 translate-y-1/2 w-[50rem] lg:w-[80rem] -translate-x-1/2 left-1/2" />
          <div className="max-w-[64rem] mx-auto flex lg:flex-row flex-col">
            <div className="flex-1 flex flex-col justify-between gap-4 py-4 lg:px-0 px-4">
              <a href="#">AlgoHive</a>
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
            <div className="flex flex-wrap items-start justify-between gap-x-28 gap-y-7">
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
