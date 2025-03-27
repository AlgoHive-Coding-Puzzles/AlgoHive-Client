import { useTranslation } from "react-i18next";
import AnimatedContainer from "../../components/AnimatedContainer";
import CirclePattern from "../../components/CirclePattern";
import Navbar from "../../components/users/Navbar";
import Footer from "../../components/Footer";

export default function LicensePage() {
  const { t } = useTranslation();

  return (
    <>
      <AnimatedContainer>
        <div className="absolute top-0 inset-x-0 h-[45rem] lg:h-[42rem] shadow-black-card bg-main-gradient overflow-hidden">
          <CirclePattern className="absolute -bottom-[135%] md:-bottom-[115%] -right-[40rem] w-[82rem]" />
        </div>
        <div className="container relative">
          <div className="h-full relative">
            <Navbar className="relative" />
            <div className="p-6 mt-10 md:p-12 rounded-2xl lg:rounded-4xl bg-white/5 backdrop-blur-[48px] md:max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
              <div className="py-6 border-b border-white/12">
                <h1 className="text-4xl font-bold text-surface-0">
                  {t("license.title")}
                </h1>
              </div>

              <div className="mt-8 space-y-12">
                <section>
                  <h2 className="text-2xl font-semibold text-amber-500 mb-4">
                    {t("license.openSource.title")}
                  </h2>
                  <p className="text-white/70 mb-4">
                    {t("license.openSource.description")}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-white/70 ml-4">
                    <li>{t("license.openSource.use")}</li>
                    <li>{t("license.openSource.modify")}</li>
                    <li>{t("license.openSource.distribute")}</li>
                    <li>{t("license.openSource.selfHost")}</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-amber-500 mb-4">
                    {t("license.privacy.title")}
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        {t("license.privacy.dataCollection.title")}
                      </h3>
                      <p className="text-white/70">
                        {t("license.privacy.dataCollection.description")}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-white/70 ml-4 mt-2">
                        <li>{t("license.privacy.dataCollection.email")}</li>
                        <li>{t("license.privacy.dataCollection.name")}</li>
                        <li>{t("license.privacy.dataCollection.password")}</li>
                        <li>
                          {t("license.privacy.dataCollection.submissions")}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        {t("license.privacy.security.title")}
                      </h3>
                      <p className="text-white/70">
                        {t("license.privacy.security.description")}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-white/70 ml-4 mt-2">
                        <li>{t("license.privacy.security.hashing")}</li>
                        <li>{t("license.privacy.security.encryption")}</li>
                        <li>{t("license.privacy.security.access")}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        {t("license.privacy.cookies.title")}
                      </h3>
                      <p className="text-white/70">
                        {t("license.privacy.cookies.description")}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-white/70 ml-4 mt-2">
                        <li>{t("license.privacy.cookies.session")}</li>
                        <li>{t("license.privacy.cookies.noTracking")}</li>
                        <li>{t("license.privacy.cookies.noThirdParty")}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        {t("license.privacy.rights.title")}
                      </h3>
                      <p className="text-white/70">
                        {t("license.privacy.rights.description")}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-white/70 ml-4 mt-2">
                        <li>{t("license.privacy.rights.access")}</li>
                        <li>{t("license.privacy.rights.delete")}</li>
                        <li>{t("license.privacy.rights.export")}</li>
                        <li>{t("license.privacy.rights.update")}</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-amber-500 mb-4">
                    {t("license.contact.title")}
                  </h2>
                  <p className="text-white/70">
                    {t("license.contact.description")}{" "}
                    <a
                      href="mailto:ericphlpp@proton.me"
                      className="text-amber-500 hover:underline"
                    >
                      ericphlpp@proton.me
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </AnimatedContainer>
      <Footer />
    </>
  );
}
